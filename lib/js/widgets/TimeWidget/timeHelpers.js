'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.parseTime = parseTime;
exports.formatTime = formatTime;
exports.formatHourMinute = formatHourMinute;
// timeString will be either a string in the form "12:30 AM" or undefined
function parseTime(timeString) {
  if (typeof timeString === 'string') {
    var _timeString$split = timeString.split(/\:|\s/),
        _timeString$split2 = _slicedToArray(_timeString$split, 3),
        hour = _timeString$split2[0],
        minute = _timeString$split2[1],
        period = _timeString$split2[2];

    return {
      hour: hour,
      minute: minute,
      period: period
    };
  }
  return {
    hour: '',
    minute: '',
    period: 'am'
  };
}

function formatTime(_ref) {
  var hour = _ref.hour,
      minute = _ref.minute,
      period = _ref.period;

  if (hour && minute.length && period) {
    return formatHourMinute(hour) + ':' + formatHourMinute(minute) + ' ' + period;
  }

  return undefined;
}

function formatHourMinute(val) {
  if (val === "") return "";
  val = Number(val);
  if (val || val === 0) {
    var hourOrMinute = val.toString();
    if (!isNaN(hourOrMinute) && hourOrMinute.length === 1) {
      return '0' + val;
    } else if (!isNaN(hourOrMinute)) {
      return hourOrMinute;
    }
  }
  return '';
}
//# sourceMappingURL=timeHelpers.js.map