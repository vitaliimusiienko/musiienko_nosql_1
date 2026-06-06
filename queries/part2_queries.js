db = db.getSiblingDB('spotify');

// Завдання 1. Треки для вечірки
print("\n--- Завдання 1. Треки для вечірки ---");
const partyTracks = db.tracks.find({
  "audio_features.danceability": { $gt: 0.7 },
  "audio_features.energy": { $gt: 0.7 },
  duration_ms: { $gte: 180000, $lte: 300000 }
}).toArray();
print("Знайдено треків:", partyTracks.length);

// Завдання 2. Виконавці, у яких усі треки популярні
print("\n--- Завдання 2. Топ популярних артистів ---");
const popularArtists = db.tracks.aggregate([
  { $unwind: "$artists" },
  { 
    $group: {
      _id: "$artists",
      track_count: { $sum: 1 },
      min_popularity: { $min: "$popularity" },
      avg_popularity: { $avg: "$popularity" }
    }
  },
  { $match: { track_count: { $gte: 3 }, min_popularity: { $gte: 60 } } },
  { 
    $project: {
      _id: 0,
      artist_name: "$_id",
      track_count: 1,
      min_popularity: 1,
      avg_popularity: { $round: ["$avg_popularity", 1] }
    }
  },
  { $sort: { avg_popularity: -1 } },
  { $limit: 20 }
]).toArray();
printjson(popularArtists);

// Завдання 3. Нетипові треки (Outliers)
print("\n--- Завдання 3. Нетипові треки за темпом ---");
const outlierTracks = db.tracks.aggregate([
  { 
    $setWindowFields: {
      partitionBy: "$track_genre",
      output: {
        avg_tempo: { $avg: "$audio_features.tempo" },
        stdDev_tempo: { $stdDevPop: "$audio_features.tempo" }
      }
    }
  },
  { 
    $addFields: {
      outlier_threshold: { $add: ["$avg_tempo", { $multiply: [2, "$stdDev_tempo"] }] }
    }
  },
  { $match: { $expr: { $gt: ["$audio_features.tempo", "$outlier_threshold"] } } },
  { 
    $group: {
      _id: "$track_genre",
      avg_tempo: { $first: "$avg_tempo" },
      outlier_threshold: { $first: "$outlier_threshold" },
      outlier_tracks: { 
        $push: {
          _id: "$_id",
          track_name: "$track_name",
          popularity: "$popularity",
          artists: "$artists",
          audio_features: { tempo: "$audio_features.tempo" }
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      avg_tempo: { $round: ["$avg_tempo", 1] },
      outlier_threshold: { $round: ["$outlier_threshold", 1] },
      outlier_tracks: 1
    }
  }
]).toArray();
print("Знайдено жанрів з аномаліями:", outlierTracks.length);

// Завдання 4: Треки для фонової роботи
print("\n--- Завдання 4. Фонова робота ---");
const focusTracks = db.tracks.find({
  "audio_features.loudness": { $lt: -10 },
  "audio_features.speechiness": { $lt: 0.1 },
  "audio_features.instrumentalness": { $gt: 0.5 },
  explicit: false
}).toArray();
print("Знайдено треків для фокусу:", focusTracks.length);