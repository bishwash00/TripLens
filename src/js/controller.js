import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import destinationView from './views/destinationView.js';
import destinationSearchView from './views/destinationSearchView.js';
import weatherView from './views/weatherView.js';
import errorView from './views/errorView.js';
import localTimeView from './views/localTimeView.js';
import mapView from './views/mapView.js';
import bookmarksView from './views/bookmarksView.js';
import recentSearchesView from './views/recentSearchesView.js';

import * as model from './model.js';

let skipNextHashChange = false;

const initData = async function () {
  try {
    renderSkeletonLoaders();

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    await model.getDataCoords(latitude, longitude);
    await model.getWeather(model.state.destination.capitalName);

    if (!window.location.hash) {
      skipNextHashChange = true;
      window.location.hash = `search=${encodeURIComponent(model.state.destination.countryName)}`;
    }

    renderDestinationData();
  } catch (err) {
    errorView.render(err);
  }
};

const controlDestinationSearch = async function (isUserSearch = true) {
  try {
    renderSkeletonLoaders();

    const query = window.location.hash.startsWith('#search=')
      ? decodeURIComponent(window.location.hash.replace('#search=', ''))
      : '';

    await model.getDestination(query);
    await model.getWeather(model.state.destination.capitalName);

    if (isUserSearch) controlRecentSearches();

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
  localTimeView.stopClock();

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

const controlRecentSearches = function () {
  model.addRecentSearch(model.state.destination);

  recentSearchesView.render(model.state.recentSearches);
};

const controlClearRecentSearches = function () {
  model.clearRecentSearches();

  recentSearchesView.render(model.state.recentSearches);
};

const init = async function () {
  if (window.location.hash && window.location.hash.startsWith('#search=')) {
    await controlDestinationSearch(false);
  } else {
    await initData();
  }

  recentSearchesView.render(model.state.recentSearches);
  bookmarksView.render(model.state.bookmarks);

  destinationSearchView.addHandlerHash(() => {
    if (skipNextHashChange) {
      skipNextHashChange = false;
      return;
    }
    controlDestinationSearch(true);
  });

  errorView.addHandlerErrorBtn(initData);
  mapView.addHandlerMap(controlMapDestination);

  bookmarksView.addHandlerBookmarkAdd(controlBookmarks);
  bookmarksView.addHandlerBookmarkRemove(controlRemoveBookmarks);
  bookmarksView.addHandlerBookmarkClick();

  recentSearchesView.addHandlerClearSearch(controlClearRecentSearches);
};
init();
