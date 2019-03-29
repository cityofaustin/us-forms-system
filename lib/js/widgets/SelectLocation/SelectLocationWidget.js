'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMapboxGl = require('react-mapbox-gl');

var _reactMapboxGl2 = _interopRequireDefault(_reactMapboxGl);

var _mapboxGl = require('mapbox-gl');

var MapboxGl = _interopRequireWildcard(_mapboxGl);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// importing the geocoder didnt seem to work at first
var MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');

var Map = (0, _reactMapboxGl2.default)({
  accessToken: 'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw'
});

var geocoderControl = new MapboxGeocoder({
  accessToken: 'pk.eyJ1IjoiY3Jvd2VhdHgiLCJhIjoiY2o1NDFvYmxkMHhkcDMycDF2a3pseDFpZiJ9.UcnizcFDleMpv5Vbv8Rngw',
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

var HERE_APP_ID = 'R3EtGwWQmTKG5eVeyLV8';
var HERE_APP_CODE = '8aDkNeOzfxGFkOKm9fER0A';

var SelectLocationMap = function (_Component) {
  _inherits(SelectLocationMap, _Component);

  function SelectLocationMap(props) {
    _classCallCheck(this, SelectLocationMap);

    var _this = _possibleConstructorReturn(this, (SelectLocationMap.__proto__ || Object.getPrototypeOf(SelectLocationMap)).call(this, props));

    _this.state = {
      center: [-97.7460479736328, 30.266184073558826],
      showPin: true
    };
    _this.onStyleLoad = _this.onStyleLoad.bind(_this);
    _this.onMoveEnd = _this.onMoveEnd.bind(_this);
    _this.onDragStart = _this.onDragStart.bind(_this);
    _this.onDragEnd = _this.onDragEnd.bind(_this);
    return _this;
  }

  _createClass(SelectLocationMap, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.lat !== prevProps.lat || this.props.lng !== prevProps.lng) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          showPin: true
        });
      }
    }
  }, {
    key: 'onDragStart',
    value: function onDragStart() {
      // debugger;
      this.setState({
        showPin: false
      });
    }
  }, {
    key: 'onMoveEnd',
    value: function onMoveEnd(map) {
      var center = map.getCenter();
      this.props.locationUpdated({ lngLat: center });
    }
  }, {
    key: 'onStyleLoad',
    value: function onStyleLoad(map) {
      var zoomControl = new MapboxGl.NavigationControl();

      map.addControl(zoomControl, 'bottom-right');

      // disable map rotation using right click + drag
      map.dragRotate.disable();

      // disable map rotation using touch rotation gesture
      map.touchZoomRotate.disableRotation();

      map.addSource('geojson-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'geocoded-point',
        source: 'geojson-point',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#007cbf'
        }
      });

      map.addControl(geocoderControl, 'top-left');

      // using mapbox geocoder's event listener to show result
      // this ought to be linked up with or replace previous code
      geocoderControl.on('result', function (event) {
        map.getSource('geojson-point').setData(event.result.geometry);
      });

      function updateGeocoderProximity() {
        // proximity is designed for local scale, if the user is looking at the whole world,
        // it doesn't make sense to factor in the arbitrary centre of the map
        if (map.getZoom() > 9) {
          var center = map.getCenter().wrap(); // ensures the longitude falls within -180 to 180 as the Geocoding API doesn't accept values outside this range
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

      map.resize();
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu() {
      this.setState({
        showPin: !this.state.showPin
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          lat = _props.lat,
          lng = _props.lng;

      var pinDrop = this.state.showPin ? 'show' : 'hide';

      return _react2.default.createElement(
        Map,
        {
          center: [lng, lat],
          onStyleLoad: this.onStyleLoad,
          onDragStart: this.onDragStart,
          onMoveEnd: this.onMoveEnd },
        _react2.default.createElement(_reactMapboxGl.Layer, {
          type: 'symbol',
          id: 'selectedLocation',
          layout: {
            'icon-image': 'marker-open-small',
            'icon-allow-overlap': true
          } }),
        _react2.default.createElement('div', { className: 'pin ' + pinDrop }),
        _react2.default.createElement('div', { className: 'pulse' })
      );
    }
  }]);

  return SelectLocationMap;
}(_react.Component);

var SelectLocationWidget = function (_React$Component) {
  _inherits(SelectLocationWidget, _React$Component);

  function SelectLocationWidget(props) {
    _classCallCheck(this, SelectLocationWidget);

    var _this2 = _possibleConstructorReturn(this, (SelectLocationWidget.__proto__ || Object.getPrototypeOf(SelectLocationWidget)).call(this, props));

    _this2.locationUpdated = _this2.locationUpdated.bind(_this2);
    _this2.onChange = _this2.onChange.bind(_this2);
    _this2.getCurrentPosition = _this2.getCurrentPosition.bind(_this2);
    return _this2;
  }

  _createClass(SelectLocationWidget, [{
    key: 'onChange',
    value: function onChange(event, _ref) {
      var newValue = _ref.newValue;

      // Keep our current location until we pick a suggestion
      var valueJSON = this.props.value ? this.props.value : this.props.schema.formData;
      var location = JSON.parse(valueJSON);

      var newLocation = {
        address: newValue,
        position: location.position
      };

      var newValueJSON = JSON.stringify(newLocation);

      this.props.onChange(newValueJSON);
    }
  }, {
    key: 'getCurrentPosition',
    value: function getCurrentPosition() {
      var _this3 = this;

      window.navigator.geolocation.getCurrentPosition(function (position) {
        var lngLat = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        _this3.locationUpdated({ lngLat: lngLat });
      }, { enableHighAccuracy: true });
    }
  }, {
    key: 'locationUpdated',
    value: function locationUpdated(_ref2) {
      var _this4 = this;

      var lngLat = _ref2.lngLat;

      var address = 'Dropped Pin';

      // Use here reverse geocoding to get a human readable address for the pin
      fetch('\n      https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=' + lngLat.lat + '%2C' + lngLat.lng + '%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=' + HERE_APP_ID + '&app_code=' + HERE_APP_CODE).then(function (response) {
        if (response.status !== 200) {
          console.error('Looks like there was a problem. Status Code: ' + response.status);

          var location = {
            address: address,
            position: lngLat
          };

          var valueJSON = JSON.stringify(location);

          _this4.props.onChange(valueJSON);

          return;
        }

        response.json().then(function (data) {
          address = data.Response.View[0].Result[0].Location.Address.Label;

          var location = {
            address: address,
            position: lngLat
          };

          var valueJSON = JSON.stringify(location);
          geocoderControl.setInput(location.address);
          _this4.props.onChange(valueJSON);
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var valueJSON = this.props.value ? this.props.value : this.props.schema.formData;
      var location = JSON.parse(valueJSON);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'map-container' },
          _react2.default.createElement(SelectLocationMap, {
            lat: location.position.lat,
            lng: location.position.lng,
            locationUpdated: this.locationUpdated })
        )
      );
    }
  }]);

  return SelectLocationWidget;
}(_react2.default.Component);

exports.default = SelectLocationWidget;
//# sourceMappingURL=SelectLocationWidget.js.map