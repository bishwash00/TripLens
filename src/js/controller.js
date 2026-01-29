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
import loadingOverlayView from './views/loadingOverlayView.js';
import suggestionsView from './views/suggestionsView.js';
import comparisionView from './views/comparisionView.js';
import offlineBannerView from './views/offlineBannerView.js';

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
    errorView.render(err, 'error');
  }
};

const controlDestinationSearch = async function (isUserSearch = true) {
  try {
    renderSkeletonLoaders();
    loadingOverlayView.addOverlay();

    const query = window.location.hash.startsWith('#search=')
      ? decodeURIComponent(window.location.hash.replace('#search=', ''))
      : '';

    await model.getDestination(query);
    await model.getWeather(model.state.destination.capitalName);

    if (isUserSearch) controlRecentSearches();

    loadingOverlayView.removeOverlay();

    renderDestinationData();
  } catch (err) {
    errorView.render(err, 'error');
    loadingOverlayView.removeOverlay();
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

    skipNextHashChange = true;
    window.location.hash = `search=${encodeURIComponent(model.state.destination.countryName)}`;

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

const controlBookmarkClick = async function (countryName) {
  const bookmark = model.state.bookmarks.find(
    b => b.countryName === countryName,
  );
  if (!bookmark) return;
  // Fetch and render all necessary data
  await model.getDestination(bookmark.countryName);
  await model.getWeather(bookmark.capitalName);
  renderDestinationData();
};

const controlRecentSearches = function () {
  model.addRecentSearch(model.state.destination);

  recentSearchesView.render(model.state.recentSearches);
};

const controlClearRecentSearches = function () {
  model.clearRecentSearches();

  recentSearchesView.render(model.state.recentSearches);
};

const controlSuggestions = async function (locationName) {
  try {
    await model.getSuggestions(locationName);

    suggestionsView.render(model.state.suggestions);
  } catch (err) {
    errorView.render(err, 'error');
  }
};

const controlCompare = async function (locationName, pos) {
  try {
    await model.setCompare(locationName, pos);

    console.log(model.state.compare);
    pos === 1
      ? comparisionView.render(model.state.compare.trip1)
      : comparisionView.render(model.state.compare.trip2);
  } catch (err) {
    errorView.render(err, 'error');
  }
};

const controlComparisonView = function () {
  const isEmpty = obj =>
    obj == null || (typeof obj === 'object' && Object.keys(obj).length === 0);

  if (
    isEmpty(model.state.compare.trip1) ||
    isEmpty(model.state.compare.trip2)
  ) {
    comparisionView.addWarning();
    return;
  }
  comparisionView.renderComparison(model.state.compare);
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
  bookmarksView.addHandlerBookmarkClick(controlBookmarkClick);

  recentSearchesView.addHandlerRecentSearchClick(
    async (capitalName, countryCode) => {
      const recent = model.state.recentSearches.find(
        r => r.capitalName === capitalName && r.countryCode === countryCode,
      );
      if (!recent) return;
      await model.getDestination(recent.countryName);
      await model.getWeather(recent.capitalName);
      renderDestinationData();
    },
  );
  recentSearchesView.addHandlerClearSearch(controlClearRecentSearches);

  suggestionsView.addHandlerInput(controlSuggestions);
  suggestionsView.addHandlerClickSearch();

  comparisionView.addHandlerSubmit(controlCompare);
  comparisionView.addHandlerCompareBtn(controlComparisonView);

  offlineBannerView.addNetworkListeners();
};
init();
