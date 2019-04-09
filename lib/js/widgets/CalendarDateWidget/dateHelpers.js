'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.parseISODate = parseISODate;
exports.formatYear = formatYear;
exports.formatDayMonth = formatDayMonth;
exports.formatISOPartialDate = formatISOPartialDate;
exports.setValidDate = setValidDate;

var _dateFns = require('date-fns');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// dateString will be either a string in the form '2011-11-11' or undefined
function parseISODate(dateString) {
  if (typeof dateString === 'string') {
    var _dateString$split = dateString.split('-', 3),
        _dateString$split2 = _slicedToArray(_dateString$split, 3),
        year = _dateString$split2[0],
        month = _dateString$split2[1],
        day = _dateString$split2[2];

    return {
      month: month,
      day: day,
      year: year
    };
  }
  return {
    month: '',
    day: '',
    year: ''
  };
}

function formatYear(val) {
  return val;
}

function formatDayMonth(val) {
  if (val === '') return '';
  var numberVal = Number(val);
  if (numberVal) {
    var dayOrMonth = numberVal.toString();
    if (Number(dayOrMonth) && dayOrMonth.length === 1) {
      return '0' + numberVal;
    } else if (Number(dayOrMonth)) {
      return dayOrMonth;
    }
  }
  return '';
}

function formatISOPartialDate(_ref) {
  var month = _ref.month,
      day = _ref.day,
      year = _ref.year;

  if (month && day && year) {
    return formatYear(year) + '-' + formatDayMonth(month) + '-' + formatDayMonth(day);
  }

  return undefined;
}

// Make sure that date is valid. If invalid, plug in approximate date.
// Approximation is made by js Date parser's convention.
// Ex: '02-31-2019' => '03-31-2019'
function setValidDate(newState) {
  var _newState$value = newState.value,
      year = _newState$value.year,
      month = _newState$value.month,
      day = _newState$value.day;
  // A reminder that js Dates start months at index=0 ;)

  var validDate = new Date(year, month - 1, day);

  var validMonth = validDate.getMonth() + 1;
  var validDay = validDate.getDate();

  if (validMonth !== Number(month)) {
    (0, _set3.default)(newState, ['value', 'month'], formatDayMonth(validMonth));
  }
  if (validDay !== Number(day)) {
    (0, _set3.default)(newState, ['value', 'day'], formatDayMonth(validDay));
  }

  // If date is in the future, go back to last year
  var isDateInFuture = (0, _dateFns.isAfter)(new Date(year, newState.value.month - 1, newState.value.day), new Date());
  if (isDateInFuture) {
    // Only need to subtract 1 year,
    // Because we do not allow years that are greater than the current year
    (0, _set3.default)(newState, ['value', 'year'], year - 1);
  }

  return newState;
}
//# sourceMappingURL=dateHelpers.js.map