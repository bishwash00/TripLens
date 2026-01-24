import 'regenerator-runtime/runtime.js';
import {
  COUNTRY_API_URL_NAME,
  GEOCODE_API_URL,
  BIG_DATA_CLOUD_KEY,
  OPENWEATHER_API_KEY,
  CURRENT_WEATHER_API_URL,
  WEATHER_FORECAST_API_URL,
  TIME_API_URL,
} from './config';
import { getJSON } from './helpers';

export const state = {
  search: {
    query: '',
  },
  destination: {
    weather: {
      current: {},
      forecast: {},
    },
    localTime: {},
  },
  location: {},
  bookmarks: [],
  recentSearches: [],
};

export const getDataCoords = async function (lat, lng) {
  try {
    const data = await getJSON(
      `${GEOCODE_API_URL}latitude=${lat}&longitude=${lng}&localityLanguage=en&key=${BIG_DATA_CLOUD_KEY}`,
    );
    console.log(data);

    await getDestination(data.countryName);
  } catch (err) {
    throw err;
  }
};

const getDestinationObject = function (data) {
  return {
    countryName: data.name.common,
    capitalName: data.capital[0],
    countryCode: data.cca2,
    countryFlag: data.flags.png,
    region: data.region,
    language: Object.values(data.languages)[0],
    currency: Object.values(data.currencies)[0],
    coordinates: data.latlng,
    population: data.population,
    bookmarked: checkBookmark(data),
    weather: {
      current: {},
      forecast: {},
    },
    localTime: {},
  };
};

const getCurrentWeather = function (data) {
  return {
    temperature: data.main.temp,
    wind: data.wind.speed,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    sunrise: formatTime(data.sys.sunrise).slice(0, -3),
    sunset: formatTime(data.sys.sunset).slice(0, -3),
    coords: {
      lat: data.coord.lat,
      lon: data.coord.lon,
    },
  };
};

const getForecastWeather = function (data) {
  const days = {};

  data.forEach(entry => {
    const date = entry.dt_txt.split(' ')[0];

    if (!days[date]) {
      days[date] = {
        temps: [],
        icon: entry.weather[0].icon,
        description: entry.weather[0].description,
        date,
      };
    }

    days[date].temps.push(entry.main.temp);

    // Prefer 12:00 data for icon/description if available
    if (entry.dt_txt.includes('12:00:00')) {
      days[date].icon = entry.weather[0].icon;
      days[date].description = entry.weather[0].description;
    }
  });

  return Object.values(days)
    .slice(0, 5)
    .map(day => ({
      date: day.date,
      min: Math.round(Math.min(...day.temps)),
      max: Math.round(Math.max(...day.temps)),
      icon: day.icon?.replace('n', 'd') || '01d',
      description: day.description,
    }));
};

const formatTime = function (timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const getLocalTime = function (data) {
  return {
    effTimeZone: data.effectiveTimeZoneFull,
    utc: data.utcOffset.length < 4 ? `${data.utcOffset}:00` : data.utcOffset,
    time: data.localTime,
    date: new Date(data.localTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
};

export const getDestination = async function (locationName) {
  try {
    const data = await getJSON(`${COUNTRY_API_URL_NAME}${locationName}`);
    console.log(data);
    state.destination = getDestinationObject(data[0]);
  } catch (err) {
    throw err;
  }
};

export const getWeather = async function (locationName) {
  try {
    const query = `${locationName},${state.destination.countryCode}`;

    const [currentWeather, forecastWeather] = await Promise.all([
      getJSON(
        `${CURRENT_WEATHER_API_URL}q=${query}&units=metric&appid=${OPENWEATHER_API_KEY}`,
      ),
      getJSON(
        `${WEATHER_FORECAST_API_URL}q=${query}&units=metric&appid=${OPENWEATHER_API_KEY}`,
      ),
    ]);

    const currentTime = await getJSON(
      `${TIME_API_URL}latitude=${currentWeather.coord.lat}&longitude=${currentWeather.coord.lon}&key=${BIG_DATA_CLOUD_KEY}`,
    );

    state.destination.weather.current = getCurrentWeather(currentWeather);

    state.destination.weather.forecast = getForecastWeather(
      forecastWeather.list,
    );

    state.destination.localTime = getLocalTime(currentTime);
  } catch (err) {
    throw err;
  }
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (destination) {
  state.bookmarks.push(destination);
  if (destination.countryName === state.destination.countryName)
    state.destination.bookmarked = true;
  persistBookmarks();
};

export const removeBookmark = function (destination) {
  const index = state.bookmarks.findIndex(
    bookmark => bookmark.countryName === destination.countryName,
  );
  console.log(index);
  state.bookmarks.splice(index, 1);

  if (destination.countryName === state.destination.countryName)
    state.destination.bookmarked = false;

  persistBookmarks();
};

const clearBookmarks = function () {
  localStorage.clear();
};

const checkBookmark = function (data) {
  if (
    state.bookmarks.some(bookmark => bookmark.countryName === data.name.common)
  )
    return true;
  return false;
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  state.bookmarks = storage ? JSON.parse(storage) : [];
  console.log(state.bookmarks);
};
init();
