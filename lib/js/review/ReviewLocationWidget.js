'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ReviewLocationWidget;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ReviewLocationWidget(props) {
  var valueJSON = props.value ? props.value : props.schema.formData;
  var location = JSON.parse(valueJSON);

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement('img', {
      src: '//maps.googleapis.com/maps/api/staticmap?markers=' + location.position.lat + ',' + location.position.lng + '&zoom=15&size=680x400&scale=1&maptype=roadmap&key=AIzaSyBqtg0ntvqWGSHOznB4kq3DiYSyyVNKzIs&style=feature:landscape%7Celement:geometry.fill%7Ccolor:0xf0eef0&style=feature:landscape.man_made%7Celement:geometry.fill%7Ccolor:0xf0eef0&style=feature:poi%7Celement:labels.text%7Cvisibility:off&style=feature:poi.business%7Cvisibility:off&style=feature:road%7Celement:labels.icon%7Cvisibility:off&style=feature:road.arterial%7Celement:geometry.fill%7Ccolor:0x7f7189&style=feature:road.arterial%7Celement:geometry.stroke%7Ccolor:0x7f7189&style=feature:road.arterial%7Celement:labels.icon%7Ccolor:0x3e3b6c&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x5e494a&style=feature:road.arterial%7Celement:labels.text.stroke%7Ccolor:0xffffff&style=feature:road.highway%7Celement:geometry.fill%7Ccolor:0xe89f9a&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0xd6613c&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x190f2c&style=feature:road.highway%7Celement:labels.text.stroke%7Ccolor:0xf6f2fd&style=feature:road.local%7Celement:geometry.fill%7Ccolor:0xb8b1bd&style=feature:road.local%7Celement:geometry.stroke%7Ccolor:0xb8b1bd&style=feature:road.local%7Celement:labels.text%7Ccolor:0xffffff&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x5e494a&style=feature:road.local%7Celement:labels.text.stroke%7Ccolor:0xffffff&style=feature:transit%7Cvisibility:off',
      alt: location.address
    }),
    _react2.default.createElement(
      'div',
      null,
      location.address
    )
  );
}
//# sourceMappingURL=ReviewLocationWidget.js.map