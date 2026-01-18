import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import destinationView from './views/destinationView.js';
import destinationSearchView from './views/destinationSearchView.js';
import weatherView from './views/weatherView.js';
import errorView from './views/errorView.js';
import localTimeView from './views/localTimeView.js';

import * as model from './model.js';

const initData = async function () {
  try {
    renderSkeletonLoaders();

    navigator.geolocation.getCurrentPosition(async function (position) {
      const { latitude, longitude } = position.coords;

      await model.getInitData(latitude, longitude);
      await model.getWeather(model.state.destination.capitalName);

      renderDestinationData();
    });
  } catch (err) {
    errorView.render(err);
  }
};

const controlDestination = async function (countryName) {
  try {
    destinationView.renderSkeletonLoading();
    await model.getDestination(countryName);

    destinationView.render(model.state.destination);
  } catch (err) {
    console.error(err.message);
  }
};

const controlDestinationSearch = async function () {
  try {
    renderSkeletonLoaders();

    const query = destinationSearchView.getQuery();

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
  localTimeView.startClock();
};

const renderSkeletonLoaders = function () {
  localTimeView.stopClock(); // Stop the clock before loading new data
  destinationView.renderSkeletonLoading();
  weatherView.renderSkeletonLoading();
  localTimeView.renderSkeletonLoading();
};

const init = function () {
  initData();

  destinationSearchView.addHandlerSearch(controlDestinationSearch);
  errorView.addHandlerErrorBtn(initData);
};
init();
