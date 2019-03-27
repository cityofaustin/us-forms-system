import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import * as MapboxGl from 'mapbox-gl';

import Autosuggest from 'react-autosuggest';

//importing the geocoder didnt seem to work at first
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw',
});

const geocoderControl = new MapboxGeocoder({
  accessToken:
    'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw',
  placeholder: 'Enter a location here',

  // bounding box restricts results to Travis County
  bbox: [-98.173053, 30.02329, -97.369564, 30.627918],
  // or texas
  // bbox: [65,25.84,-93.51,36.5],
  // or by country:
  // countries: 'us',
  limit: 5,
  trackProximity: true,
});

const HERE_APP_ID = `R3EtGwWQmTKG5eVeyLV8`;
const HERE_APP_CODE = `8aDkNeOzfxGFkOKm9fER0A`;

class SelectLocationMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: [-97.7460479736328, 30.266184073558826],
      showPin: true,
    };
    this.onStyleLoad = this.onStyleLoad.bind(this);
    this.onMoveEnd = this.onMoveEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.lat != prevProps.lat || this.props.lng != prevProps.lng) {
      this.setState({
        showPin: true,
      });
    }
  }

  toggleMenu() {
    this.setState({
      showPin: !this.state.showPin,
    });
  }

  onDragStart(map) {
    // debugger;
    this.setState({
      showPin: false,
    });
  }

  onDragEnd(map) {
    // this.toggleMenu();
  }

  onMoveEnd(map) {
    const center = map.getCenter();
    this.props.locationUpdated({ lngLat: center });
  }

  onStyleLoad(map) {
    const zoomControl = new MapboxGl.NavigationControl();

    map.addControl(zoomControl, 'bottom-right');

    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    map.addSource('geojson-point', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    map.addLayer({
      id: 'geocoded-point',
      source: 'geojson-point',
      type: 'circle',
      paint: {
        'circle-radius': 10,
        'circle-color': '#007cbf',
      },
    });

    map.addControl(geocoderControl, 'top-left');

    // using mapbox geocoder's event listener to show result
    // this ought to be linked up with or replace previous code
    geocoderControl.on('result', function(event) {
      map.getSource('geojson-point').setData(event.result.geometry);
    });

    map.on('load', updateGeocoderProximity); // set proximity on map load
    map.on('moveend', updateGeocoderProximity); // and then update proximity each time the map moves

    function updateGeocoderProximity() {
      // proximity is designed for local scale, if the user is looking at the whole world,
      // it doesn't make sense to factor in the arbitrary centre of the map
      if (map.getZoom() > 9) {
        var center = map.getCenter().wrap(); // ensures the longitude falls within -180 to 180 as the Geocoding API doesn't accept values outside this range
        geocoderControl.setProximity({
          longitude: center.lng,
          latitude: center.lat,
        });
      } else {
        geocoderControl.setProximity(null);
      }
    }

    map.resize();
  }

  render() {
    const { lat, lng } = this.props;
    const pinDrop = this.state.showPin ? 'show' : 'hide';

    return (
      <Map
        style={'mapbox://styles/croweatx/cjow5d6cd3l7g2snrvf17wf0r'}
        center={[lng, lat]}
        onStyleLoad={this.onStyleLoad}
        onDragStart={this.onDragStart}
        onMoveEnd={this.onMoveEnd}
      >
        <Layer
          type="symbol"
          id="selectedLocation"
          layout={{
            'icon-image': 'marker-open-small',
            'icon-allow-overlap': true,
          }}
        >
          {/*
          <Feature
            coordinates={[lng, lat]}
            draggable={true}
            onMoveEnd={this.props.locationUpdated}
          /> */}
        </Layer>

        <div className={`pin ${pinDrop}`} />
        <div className="pulse" />
      </Map>
    );
  }
}

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : languages.filter(
        lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue,
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => {
  return suggestion.name;
};

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

export default class SelectLocationWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
    };

    this.locationUpdated = this.locationUpdated.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this,
    );
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this,
    );
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
  }

  locationUpdated({ lngLat }) {
    var address = 'Dropped Pin';

    // Use here reverse geocoding to get a human readable address for the pin
    fetch(`
      https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=${
        lngLat.lat
      }%2C${
      lngLat.lng
    }%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}`).then(
      response => {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status,
          );

          const location = {
            address: address,
            position: lngLat,
          };

          const valueJSON = JSON.stringify(location);

          this.props.onChange(valueJSON);

          return;
        }

        response.json().then(data => {
          address = data.Response.View[0].Result[0].Location.Address.Label;

          const location = {
            address: address,
            position: lngLat,
          };

          const valueJSON = JSON.stringify(location);
          geocoderControl.setInput(location.address);
          this.props.onChange(valueJSON);
        });
      },
    );
  }

  onChange(event, { newValue }) {
    // Keep our current location until we pick a suggestion
    const valueJSON = this.props.value
      ? this.props.value
      : this.props.schema.formData;
    const location = JSON.parse(valueJSON);

    const newLocation = {
      address: newValue,
      position: location.position,
    };

    const newValueJSON = JSON.stringify(newLocation);

    this.props.onChange(newValueJSON);
  }

  onSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method },
  ) {
    if (suggestion.location) {
      const address = suggestionValue;
      const lng = suggestion.location[1];
      const lat = suggestion.location[0];

      const location = {
        address: address,
        position: { lng: lng, lat: lat },
      };

      const valueJSON = JSON.stringify(location);

      this.props.onChange(valueJSON);
    }

    // Unfocus the search bar
    this.autosuggestInput.blur();
  }

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested({ value }) {
    const inputLength = value.length;

    if (inputLength > 2) {
      const valueJSON = this.props.value
        ? this.props.value
        : this.props.schema.formData;
      const location = JSON.parse(valueJSON);

      fetch(
        `https://places.api.here.com/places/v1/autosuggest?at=${
          location.position.lat
        },${
          location.position.lng
        }&q=${value}&app_id=${HERE_APP_ID}&app_code=${HERE_APP_CODE}`,
      )
        .then(response => {
          if (response.status !== 200) {
            console.log(
              'Looks like there was a problem. Status Code: ' + response.status,
            );
            this.setState({ suggestions: [] });
            return;
          }

          response.json().then(data => {
            const filteredResults = data.results.filter(
              result => result.position && result.vicinity,
            );
            const suggestions = filteredResults.map(result => ({
              name: result.title,
              location: result.position,
              humanAddress: result.vicinity.replace(/<br\/>/g, ', '),
            }));
            this.setState({ suggestions: suggestions });
          });
        })
        .catch(err => {
          console.log('Fetch Error :-S', err);
          this.setState({ suggestions: [] });
        });
    } else {
      this.setState({ suggestions: [] });
    }
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
      value: '',
    });
  }

  getCurrentPosition() {
    window.navigator.geolocation.getCurrentPosition(
      position => {
        const lngLat = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.locationUpdated({ lngLat });
      },
      error => {
        debugger;
      },
      { enableHighAccuracy: true },
    );
  }

  render() {
    const valueJSON = this.props.value
      ? this.props.value
      : this.props.schema.formData;
    const location = JSON.parse(valueJSON);

    const inputProps = {
      value: location.address,
      onChange: this.onChange,
    };

    return (
      <div>
        <div className="map-container">
          <SelectLocationMap
            lat={location.position.lat}
            lng={location.position.lng}
            locationUpdated={this.locationUpdated}
          />
        </div>
      </div>
    );
  }
}
