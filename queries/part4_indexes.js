db = db.getSiblingDB('spotify');

// --- Завдання 1 ---
const query1 = { track_genre: "pop", "audio_features.danceability": { $gte: 0.7 } };
const sort1 = { popularity: -1 };

// Аналіз ДО створення індексу (вивід COLLSCAN)
print("\n--- Explain ДО створення індексу ---");
printjson(db.tracks.find(query1).sort(sort1).explain("executionStats").executionStats);

// Створення складеного індексу за правилом ESR (Equality, Sort, Range)
db.tracks.createIndex({ track_genre: 1, popularity: -1, "audio_features.danceability": 1 });

// Аналіз ПІСЛЯ створення індексу (вивід IXSCAN та суттєве зменшення executionTimeMillis)
print("\n--- Explain ПІСЛЯ створення індексу ---");
printjson(db.tracks.find(query1).sort(sort1).explain("executionStats").executionStats);

// --- Завдання 2 ---
// Індекс для фонових треків
db.tracks.createIndex({ 
  explicit: 1, 
  "audio_features.instrumentalness": 1, 
  "audio_features.speechiness": 1 
});

const query2 = {
  explicit: false,
  "audio_features.instrumentalness": { $gt: 0.5 },
  "audio_features.speechiness": { $lt: 0.1 }
};
print("\n--- Explain для фонових треків ---");
printjson(db.tracks.find(query2).explain("executionStats").executionStats);