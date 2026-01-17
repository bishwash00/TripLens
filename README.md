# 🌍 TripLens

**TripLens** is a modern travel & city‑insights web application built with **vanilla JavaScript**. It allows users to search any city in the world and instantly explore **current weather**, **5‑day forecast**, **map location**, and **local information**, all powered by real APIs.

This project was built with a strong focus on **real‑world architecture, async JavaScript, API chaining, and state management**.

---

## ✨ Features

- 🔍 **City search by name** (global support)
- 📍 **Geocoding** (city → latitude/longitude)
- ☁️ **Current weather** (real‑time)
- 📅 **5‑day forecast** (aggregated from 3‑hour data)
- 🗺️ **Interactive map** with city marker
- 🕒 **Timezone‑aware date handling** (Today / Tomorrow / weekday)
- ⚠️ Graceful **error handling** & loading states

---

## 🧠 What This Project Demonstrates

This is **not a beginner tutorial app**. TripLens demonstrates:

- Asynchronous JavaScript (`async / await`)
- API chaining & data normalization
- Centralized **state management** (MVC‑style)
- Separation of concerns (model / view / controller)
- Real‑world handling of **timezones** and dates
- Accessibility‑aware UI design

---

## 🧱 Tech Stack

- **JavaScript (ES6+)**
- **HTML5**
- **CSS3** (custom design system)
- **Fetch API**
- **Leaflet.js** (maps)

No frameworks, no libraries — **pure JavaScript**.

---

## 🌐 APIs Used

### 1️⃣ OpenWeather – Geocoding API

Converts city name → latitude & longitude

```
https://api.openweathermap.org/geo/1.0/direct
```

---

### 2️⃣ OpenWeather – Current Weather API

Real‑time weather data

```
https://api.openweathermap.org/data/2.5/weather
```

---

### 3️⃣ OpenWeather – 5‑Day / 3‑Hour Forecast API

Used to compute a **daily forecast**

```
https://api.openweathermap.org/data/2.5/forecast
```

---

### 4️⃣ Leaflet + OpenStreetMap

Interactive maps (no API key required)

---

### 5️⃣ (Optional) Reverse Geocoding – BigDataCloud

Latitude/longitude → city & country (free, no key)

```
https://api.bigdatacloud.net/data/reverse-geocode-client
```

---

## 🗂️ Application State Structure

```js
state = {
  location: {
    city: '',
    country: '',
    lat: null,
    lng: null,
    timezone: null,
  },
  weather: {
    current: {},
    forecast: [],
  },
  ui: {
    isLoading: false,
    error: '',
  },
};
```

---

## 🕒 Timezone‑Correct Forecast Logic

Because users and searched cities can be in **different timezones**, TripLens uses the timezone offset returned by the API to correctly label forecast days as:

```
Today
Tomorrow
Wed
Thu
```

This avoids common bugs where dates appear **one day early or late**.

---

## 🚀 Getting Started

1. Clone the repository

```
git clone https://github.com/your-username/triplens.git
```

2. Install dependencies (none required)

3. Add your OpenWeather API key

```js
const API_KEY = 'YOUR_API_KEY';
```

4. Run using a local server (recommended)

---

## 🧪 Suggested Test Cities

- Kathmandu (Nepal)
- London (UK)
- New York (USA)
- Tokyo (Japan)
- Sydney (Australia)

These help verify timezone correctness.

---

## 📈 Future Improvements

- Autocomplete city search
- Save recent searches
- Unit preference toggle (°C / °F)
- Offline caching
- Country & currency info

---

## 🙌 Credits

- Weather data by **OpenWeather**
- Maps by **OpenStreetMap**

---

## 📄 License

This project is for **learning and portfolio purposes**.

---

**TripLens — See the world, one city at a time.** 🌍
