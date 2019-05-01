import React, { Component } from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import { NavigationControl } from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

const HERE_APP_ID = 'R3EtGwWQmTKG5eVeyLV8';
const HERE_APP_CODE = '8aDkNeOzfxGFkOKm9fER0A';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw';
const GEOCODE_DEBUG = false;
const MAP_LANGUAGE = 'englishMap';

const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN,
});

const geocoderControl = new MapboxGeocoder({
  accessToken: MAPBOX_TOKEN,
  placeholder: 'Enter a location here',

  // bounding box restricts results to Travis County
  bbox: [-98.173053, 30.02329, -97.369564, 30.627918],
  // or texas
  // bbox: [65,25.84,-93.51,36.5],
  // or by country:
  // countries: 'us',
  limit: 5,
  trackProximity: true
});

export default class SelectLocationWidget extends Component {
  constructor(props) {
    super(props);

    this.locationUpdated = this.locationUpdated.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onStyleLoad = this.onStyleLoad.bind(this);
    this.onMoveEnd = this.onMoveEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onForwardGeocodeResult = this.onForwardGeocodeResult.bind(this);
    this.onGeocoderClear = this.onGeocoderClear.bind(this);

    // take location data from the form if it exists, or use a default
    const location = props.value
      ? JSON.parse(props.value)
      : {
        address: 'default',
        position: {
          lng: null,
          lat: null
        }
      };

    this.state = {
      center: [location.position.lng, location.position.lat],
      showPin: true,
      geocodeAddressString: location.address,
      formValue: props.value || ''
    };
  }

  onForwardGeocodeResult(geocodeResult) {
    const address = geocodeResult.result.place_name;
    this.setState({ geocodeAddressString: address });
  }

  onDragStart() {
    this.setState({
      showPin: false
    });
  }

  onDragEnd() {
    this.setState({
      geocodeAddressString: null,
      showPin: true
    });
  }

  onMoveEnd(map) {
    const center = map.getCenter();
    this.locationUpdated({ lngLat: center, addressString: this.state.geocodeAddressString });
  }

  // calls us-forms-system onChange to propogate values up to the form
  onChange(newFormValue) {
    this.props.onChange(newFormValue);
    this.setState({ formValue: newFormValue });
  }

  onGeocoderClear() {
    this.onChange({});
  }

  onStyleLoad(map) {
    const language = new MapboxLanguage();
    if (MAP_LANGUAGE === 'spanishMap') {
      map.setStyle(language.setLanguage(map.getStyle(), 'es'));
    }


    // disable map rotation using right click + drag
    map.dragRotate.disable();
    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    const zoomControl = new NavigationControl();
    map.addControl(zoomControl, 'bottom-right');
    map.addControl(geocoderControl, 'top-left');

    geocoderControl.on('result', this.onForwardGeocodeResult);

    geocoderControl.on('clear', this.onGeocoderClear);

    function updateGeocoderProximity() {
      // proximity is designed for local scale, if the user is looking at the whole world,
      // it doesn't make sense to factor in the arbitrary centre of the map
      if (map.getZoom() > 9) {
        const center = map.getCenter().wrap(); // ensures the longitude falls within -180 to 180 as the Geocoding API doesn't accept values outside this range
        geocoderControl.setProximity({
          longitude: center.lng,
          latitude: center.lat
        });
      } else {
        geocoderControl.setProximity(null);
      }
    }

    map.on('load', updateGeocoderProximity); // set proximity on map load
    map.on('moveend', updateGeocoderProximity); // and then update proximity each time the map moves

    // set initial center
    map.setCenter([-97.7460479736328, 30.266184073558826]);
    map.resize();
  }

  // prepare geocoded result to be propogated to form
  passGeocodedResult({ lngLat, addressString }) {
    const location = {
      address: addressString === 'default' ? null : addressString,
      position: lngLat
    };
    const locationJSON = JSON.stringify(location);

    // update the geocoder input box with the address label
    if (addressString !== 'default') {
      this.onChange(locationJSON);
      geocoderControl.setInput(location.address);
    }
  }

  reverseGeocode({ lngLat }) {
    // some tech debt here fer sure
    // eslint-disable-next-line no-unused-vars
    const mapboxURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng}%2C${lngLat.lat}.json?access_token=${MAPBOX_TOKEN}`;
    // eslint-disable-next-line no-unused-vars
    const hereURL = `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${lngLat.lat}%2C${lngLat.lng}%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}`;
    if (GEOCODE_DEBUG) {
      fetch(mapboxURL).then(response => {
        const provider = 'mapbox: ';
        if (response.status !== 200) {
          console.error(`Looks like there was a problem. Status Code: ${response.status}`);
          return;
        }

        response.json().then(data => {
          const mapboxAddress = data.features[0].place_name;
          console.info(provider + JSON.stringify(data));
          console.info(mapboxAddress);
        });
      });

      fetch(hereURL).then(response => {
        const provider = 'HERE: ';
        if (response.status !== 200) {
          console.error(`Looks like there was a problem. Status Code: ${response.status}`);
          return;
        }

        response.json().then(data => {
          const hereAddress = data.Response.View[0].Result[0].Location.Address.Label;
          console.info(provider + JSON.stringify(data));
          console.info(hereAddress);
        });
      });
    }
    fetch(mapboxURL).then(response => {
      if (response.status !== 200) {
        console.error(`Looks like there was a problem. Status Code: ${response.status}`);
        const address = 'Dropped Pin';
        this.passGeocodedResult({ lngLat, addressString: address });
        return;
      }

      response.json().then(data => {
        const mapboxAddress = data.features[0].place_name;
        const address = mapboxAddress;
        this.passGeocodedResult({ lngLat, addressString: address });
      });
    });
  }

  locationUpdated({ lngLat, addressString }) {
    // If we have an address string, skip calling the reverse geocoder
    if (addressString) {
      this.passGeocodedResult({ lngLat, addressString });
      return;
    }

    this.reverseGeocode({ lngLat });
  }

  render() {
    const pinDrop = this.state.showPin ? 'show' : 'hide';

    return (
      <div>
        <div className="map-container">
          <Map
            // eslint-disable-next-line react/style-prop-object
            style={'mapbox://styles/croweatx/cjow5d6cd3l7g2snrvf17wf0r'}
            onStyleLoad={this.onStyleLoad}
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
            onMoveEnd={this.onMoveEnd}>
            <div className={`pin ${pinDrop}`}/>
            <div className="pulse"/>
          </Map>
        </div>
      </div>
    );
  }
}
