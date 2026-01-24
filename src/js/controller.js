import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import destinationView from './views/destinationView.js';
import destinationSearchView from './views/destinationSearchView.js';
import weatherView from './views/weatherView.js';
import errorView from './views/errorView.js';
import localTimeView from './views/localTimeView.js';
import mapView from './views/mapView.js';
import bookmarksView from './views/bookmarksView.js';

import * as model from './model.js';

const initData = async function () {
  try {
    renderSkeletonLoaders();

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    await model.getDataCoords(latitude, longitude);
    await model.getWeather(model.state.destination.capitalName);

    window.location.hash =
      window.location.hash = `search=${encodeURIComponent(model.state.destination.countryName)}`;

    renderDestinationData();
  } catch (err) {
    errorView.render(err);
  }
};

const controlDestinationSearch = async function () {
  try {
    renderSkeletonLoaders();

    const query = window.location.hash.startsWith('#search=')
      ? decodeURIComponent(window.location.hash.replace('#search=', ''))
      : '';

    await model.getDestination(query);
    await model.getWeather(model.state.destination.capitalName);

    renderDestinationData();
  } catch (err) {
    errorView.render(err, 'error');
  }
};

const renderDestinationData = function () {
  destinationView.render(model.state.destination);
  weatherView.render(model.state.destination.weather);
  localTimeView.render(model.state.destination);

  mapView.render(model.state.destination.weather.current.coords);
  mapView.renderMap();

  localTimeView.startClock();
};

const renderSkeletonLoaders = function () {
  localTimeView.stopClock(); // Stop the clock before loading new data

  destinationView.renderSkeletonLoading();
  weatherView.renderSkeletonLoading();
  localTimeView.renderSkeletonLoading();
};

const controlMapDestination = async function (lat, lng) {
  try {
    renderSkeletonLoaders();

    const latitude = lat;
    const longitude = lng;

    await model.getDataCoords(latitude, longitude);
    await model.getWeather(model.state.destination.capitalName);

    renderDestinationData();
  } catch (err) {
    errorView.render(err, 'error');
  }
};

const controlBookmarks = function () {
  const isBookmarked = model.state.bookmarks.some(
    bookmark => bookmark.countryName === model.state.destination.countryName,
  );
  if (!isBookmarked) model.addBookmark(model.state.destination);
  else model.removeBookmark(model.state.destination);

  bookmarksView.render(model.state.bookmarks);
};

const controlRemoveBookmarks = function (countryName) {
  const bookmark = model.state.bookmarks.find(
    bookmark => bookmark.countryName === countryName,
  );
  console.log(bookmark);

  if (bookmark) model.removeBookmark(bookmark);

  bookmarksView.render(model.state.bookmarks);
};

const init = async function () {
  await initData();

  bookmarksView.render(model.state.bookmarks);

  destinationSearchView.addHandlerHash(controlDestinationSearch);

  errorView.addHandlerErrorBtn(initData);
  mapView.addHandlerMap(controlMapDestination);

  bookmarksView.addHandlerBookmarkAdd(controlBookmarks);
  bookmarksView.addHandlerBookmarkRemove(controlRemoveBookmarks);
  bookmarksView.addHandlerBookmarkClick();
};
init();
