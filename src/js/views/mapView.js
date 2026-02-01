import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icons from 'url:../../img/icons.svg';
import View from './View';

class mapView extends View {
  _parentEl = document.querySelector('.card__content--map');
  _map = null;
  _marker = null;
  _handler = null;

  _generateMarkup() {
    return `
    <div class="map-container">
      <div class="map" id="map"></div>
      <div class="map__coordinates">
        <span class="map__lat">Lat: ${this._data.lat}</span>
        <span class="map__lng">Lng: ${this._data.lon}</span>
      </div>
    </div>`;
  }

  renderMap(lat = this._data.lat, lng = this._data.lon) {
    const container = document.getElementById('map');
    if (!container) return;

    // Clean up old map if exists
    if (this._map) {
      this._map.off();
      this._map.remove();
      this._map = null;
    }

    // Clear stale Leaflet reference from container (fixes "reused by another instance")
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    // Use requestAnimationFrame to defer map initialization
    requestAnimationFrame(() => {
      this._map = L.map('map', {
        preferCanvas: true, // Use canvas renderer for better performance
      }).setView([lat, lng], 13);

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap contributors © CARTO',
          maxZoom: 19,
          updateWhenIdle: true, // Defer tile loading until map interaction ends
        },
      ).addTo(this._map);

      this._marker = L.marker([lat, lng]).addTo(this._map);

      // Re-attach handler if it exists
      if (this._handler) this._attachClickHandler();
    });
  }

  _attachClickHandler() {
    this._map.on('click', e => {
      const { lat, lng } = e.latlng;

      if (this._marker) this._marker.remove();

      this._marker = L.marker([lat, lng]).addTo(this._map);

      this._handler(lat, lng);
    });
  }

  addHandlerMap(handler) {
    this._handler = handler;

    if (!this._map) return;

    this._attachClickHandler();
  }
}

export default new mapView();
