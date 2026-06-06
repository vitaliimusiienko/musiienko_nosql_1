db = db.getSiblingDB('spotify');
db.tracks.drop(); // Ідемпотентність

db.tracks_raw.aggregate([
  {
    $addFields: {
      artists: {
        $map: {
          input: { $split: ["$artists", ";"] },
          as: "artist",
          in: { $trim: { input: "$$artist" } }
        }
      },
      duration_sec: { $round: [{ $divide: ["$duration_ms", 1000] }, 1] },
      popularity_tier: {
        $switch: {
          branches: [
            { case: { $gte: ["$popularity", 70] }, then: "high" },
            { case: { $gte: ["$popularity", 40] }, then: "medium" }
          ],
          default: "low"
        }
      },
      audio_features: {
        danceability: "$danceability",
        energy: "$energy",
        loudness: "$loudness",
        speechiness: "$speechiness",
        acousticness: "$acousticness",
        instrumentalness: "$instrumentalness",
        liveness: "$liveness",
        valence: "$valence",
        tempo: "$tempo",
        key: "$key",
        mode: "$mode",
        time_signature: "$time_signature"
      }
    }
  },
  {
    $project: {
      _id: 0,
      track_id: 1,
      track_name: 1,
      album_name: 1,
      explicit: 1,
      popularity: 1,
      duration_ms: 1,
      track_genre: 1,
      artists: 1,
      duration_sec: 1,
      popularity_tier: 1,
      audio_features: 1
    }
  },
  { $out: "tracks" }
]);

print("Кількість документів у tracks:", db.tracks.countDocuments({}));
print("Приклад документа:");
printjson(db.tracks.findOne());