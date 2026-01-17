import 'regenerator-runtime/runtime.js';
import {
  COUNTRY_API_URL_NAME,
  GEOCODE_API_URL,
  GEOCODE_KEY,
  OPENWEATHER_API_KEY,
  CURRENT_WEATHER_API_URL,
  WEATHER_FORECAST_API_URL,
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
  },
  location: {},
  bookmarks: [],
  recentSearches: [],
};

export const getInitData = async function (lat, lng) {
  try {
    const data = await getJSON(
      `${GEOCODE_API_URL}latitude=${lat}&longitude=${lng}&localityLanguage=en&key=${GEOCODE_KEY}`
    );

    await getDestination(data.countryName);
  } catch (err) {
    throw err;
  }
};

const getDestinationObject = function (data) {
  return {
    countryName: data.name.common,
    capitalName: data.capital[0],
    countryFlag: data.flags.png,
    region: data.region,
    language: Object.values(data.languages)[0],
    currency: Object.values(data.currencies)[0],
    coordinates: data.latlng,
    population: data.population,
    weather: {
      current: {},
      forecast: {},
    },
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

export const getDestination = async function (locationName) {
  try {
    const data = await getJSON(`${COUNTRY_API_URL_NAME}${locationName}`);

    state.destination = getDestinationObject(data[0]);
  } catch (err) {
    throw err;
  }
};

export const getWeather = async function (locationName) {
  try {
    const [currentWeather, forecastWeather] = await Promise.all([
      getJSON(
        `${CURRENT_WEATHER_API_URL}q=${locationName}&units=metric&appid=${OPENWEATHER_API_KEY}`
      ),
      getJSON(
        `${WEATHER_FORECAST_API_URL}q=${locationName}&units=metric&appid=${OPENWEATHER_API_KEY}`
      ),
    ]);

    state.destination.weather.current = getCurrentWeather(currentWeather);

    state.destination.weather.forecast = getForecastWeather(
      forecastWeather.list
    );
  } catch (err) {
    throw err;
  }
};
