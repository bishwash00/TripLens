# 🌍 TripLens

TripLens is a modern travel and city insights web application built with vanilla JavaScript. It allows users to search for any country, view current weather, a 5-day forecast, interactive map, local time, and compare destinations. All data is powered by real APIs.

---

## ✨ Features

- **Search for a country** by name
- **Current weather** for the capital city
- **5-day weather forecast** (daily min/max, icon, description)
- **Interactive map** (Leaflet.js, click to update destination)
- **Local time** and timezone info for the destination
- **Bookmark destinations** for quick access
- **Recent searches** (last 5 destinations)
- **Destination comparison** (compare two countries on weather, time, population, currency, language)
- **Suggestions** as you type in the search bar
- **Offline banner** when network is lost
- **Loading overlays** and skeleton screens
- **Graceful error handling**

---

## 🧱 Tech Stack

- JavaScript (ES6+)
- HTML5
- CSS3 (Sass)
- Fetch API
- Leaflet.js (maps)

No frameworks, no build step required.

---

## 🌐 APIs Used

- **OpenWeather** (current weather, 5-day forecast)
- **BigDataCloud** (reverse geocoding)
- **REST Countries** (country info)
- **Leaflet + OpenStreetMap** (maps)

---

## 🗂️ Main Functionalities

- **Destination Search:** Search for a country and view its capital, region, population, language, currency, and coordinates.
- **Weather:** View current weather and a 5-day forecast for the capital city.
- **Map:** Interactive map with marker for the capital; click on the map to update the destination.
- **Local Time:** See the local time, date, timezone, sunrise, and sunset for the destination.
- **Bookmarks:** Save and remove favorite destinations. Bookmarks are persisted in local storage.
- **Recent Searches:** Quickly revisit the last 5 searched destinations. Clear all with one click.
- **Suggestions:** Get live suggestions as you type in the search bar.
- **Compare:** Compare two destinations side-by-side on weather, time, population, currency, and language.
- **Offline Banner:** Notifies when the app is offline.
- **Loading & Error States:** Skeleton loaders and overlays for async actions, with user-friendly error messages.

---

## 🚀 Getting Started

1. Clone the repository
   ```
   git clone <your-repo-url>
   ```
2. Add your OpenWeather API key in `src/js/config.js`
3. Open `index.html` with a local server (e.g. Live Server extension)

---

## 🧪 Example Destinations

- Nepal
- United Kingdom
- United States
- Japan
- Australia

---

## 📄 License

This project is for learning and portfolio purposes only.

---

**TripLens — See the world, one country at a time.** 🌍
