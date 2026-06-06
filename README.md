# Musiienko_nosql_1: Аналітична платформа для стрімінгового сервісу

## Налаштування оточення
1. Встановіть залежності: `pip install -r requirements.txt`
2. Створіть файл `.env` у корені проєкту та додайте свій URI:
   `MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/`
3. Запустіть скрипт імпорту: `python scripts/01_load_data.py`
4. Виконайте трансформацію схеми через Mongo Shell:
   `mongosh "ВАШ_URI" --file scripts/02_transform.js`

## Схема даних
Після трансформації документи в колекції `tracks` мають наступний вигляд. Поля нормалізовані, а аудіохарактеристики логічно згруповані:
```json
{
  "track_id": "5SuOeqw",
  "track_name": "Comedy",
  "album_name": "Comedy",
  "explicit": false,
  "popularity": 71,
  "duration_ms": 230666,
  "track_genre": "acoustic",
  "artists": ["Gen Hoshino"],
  "duration_sec": 230.7,
  "popularity_tier": "high",
  "audio_features": {
    "danceability": 0.676,
    "energy": 0.461,
    "loudness": -6.746,
    "speechiness": 0.143,
    "acousticness": 0.0322,
    "instrumentalness": 0.00000101,
    "liveness": 0.358,
    "valence": 0.715,
    "tempo": 87.917,
    "key": 1,
    "mode": 0,
    "time_signature": 4
  }
}