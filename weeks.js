'use strict';

var moment = require('moment');


var _buffer;
var _startDate;
var _weeksAdjustment;
var _weeksAmount;

function Weeks() {
  _buffer = [];
  _startDate = undefined;
  _weeksAdjustment = undefined;
  _weeksAmount = undefined;
}

function _ofPreposition(locale) {
  var map = {
    "en": "of",
    "es": "de"
  };

  if (map[locale]) {
    return map[locale]
  }

  if (this.locale() !== 'en') {
    return map[this.locale()];
  } else {
    return map.en;
  }
}

function locale(locale) {
  if (locale) {
    this._locale = locale;

    return this;
  } else {
    return this._locale;
  }
}

function get(weeksAmount, startDate, iterationCallable) {
  // give a start date
  if (!weeksAmount) {
    // throw error
    throw new Error('weeksAmount needs to be set.');
  }

  if (!startDate) {
    startDate = new Date();
  }

  if (startDate instanceof Date === false) {
    throw new Error('startDate must be a Date object');
  }

  _startDate = startDate;
  _weeksAmount = weeksAmount;

  return this;
}

function map(iterationCallable) {
  var self = this;

  if (typeof iterationCallable === 'function') {
    var limitedMethods = {
      locale,
      ofPreposition: _ofPreposition,
      _locale: self._locale
    };

    var _locale = this.locale();
    moment.locale(_locale);

    for (let iteration = 0, weeksAdjustment = 0; iteration < _weeksAmount; iteration++) {
      // first week
      // get monday Date
      weeksAdjustment = 7 * iteration;

      var momentDay = moment(_startDate);
      var adjustedMomentDay = momentDay.day(momentDay.day() + weeksAdjustment);

      let result = iterationCallable.call(limitedMethods, adjustedMomentDay, _startDate);

      if (result) {
        _buffer.push(result);
      }
    }

    return _buffer;
  }
}

function values() {
  for (let iteration = 0, weeksAdjustment = 0; iteration < _weeksAmount; iteration++) {
    weeksAdjustment = 7 * iteration;

    var momentDay = moment(_startDate);

    momentDay.day(momentDay.day() + weeksAdjustment);

    _buffer.push(momentDay.toDate());
  }

  return _buffer;
}

function factory() {
  return new Weeks();
}

Weeks.prototype._locale = 'en';
Weeks.prototype.locale = locale;
Weeks.prototype.get = get;
Weeks.prototype.map = map;
Weeks.prototype.values = values;
Weeks.prototype.ofPreposition = _ofPreposition;

module.exports = factory;