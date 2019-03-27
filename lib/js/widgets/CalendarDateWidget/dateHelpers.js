'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.parseISODate = parseISODate;
exports.formatISOPartialDate = formatISOPartialDate;
exports.formatYear = formatYear;
exports.formatDayMonth = formatDayMonth;
// dateString will be either a string in the form "2011-11-11" or undefined
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

function formatISOPartialDate(_ref) {
  var month = _ref.month,
      day = _ref.day,
      year = _ref.year;

  if (month && day && year) {
    return formatYear(year) + '-' + formatDayMonth(month) + '-' + formatDayMonth(day);
  }

  return undefined;
}

function formatYear(val) {
  return val;
}

function formatDayMonth(val) {
  if (val === "") return "";
  val = Number(val);
  if (val) {
    var dayOrMonth = val.toString();
    if (Number(dayOrMonth) && dayOrMonth.length === 1) {
      return '0' + val;
    } else if (Number(dayOrMonth)) {
      return dayOrMonth;
    }
  }
  return '';
}
//# sourceMappingURL=dateHelpers.js.map