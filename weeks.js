'use strict';

(function (module) {
  var moment = require('moment');


  var _buffer;
  var _startDate;
  var _weeksAdjustment;
  var _weeksAmount;

  function Weeks() {
    _buffer = [];
    _startDate = new Date();
    _weeksAdjustment = undefined;
    _weeksAmount = undefined;

    if(! (this instanceof Weeks)) {
      return new Weeks();
    }
  }

  function _ofPreposition(locale) {
    var map = {
      "en": "of",
      "es": "de"
    };

    if (map[locale]) {
      return map[locale]
    }

    if (this.withLocale() !== 'en') {
      return map[this.withLocale()];
    } else {
      return map.en;
    }
  }

  function withLocale(locale) {
    if (locale) {
      this._locale = locale;

      return this;
    } else {
      return this._locale;
    }
  }

  function starting(date) {
    if (!date) {
      date = new Date();
    }

    if (date instanceof Date === false) {
      throw new Error('startDate must be a Date object');
    }

    _startDate = date;

    return this;
  }

  function get(weeksAmount) {
    // give a start date
    if (!weeksAmount) {
      // throw error
      throw new Error('weeksAmount needs to be set.');
    }

    _weeksAmount = weeksAmount;

    return this;
  }

  function mapped(iterationCallable) {
    var self = this;

    if (typeof iterationCallable === 'function') {
      var limitedMethods = {
        withLocale,
        ofPreposition: _ofPreposition,
        _locale: self._locale
      };

      var _locale = this.withLocale();
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

  function mapPartial(callable) {
    var self = this;

    return function() {
      return mapped.call(self, callable);
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

  Weeks.prototype._locale = 'en';
  Weeks.prototype.starting = starting;
  Weeks.prototype.withLocale = withLocale;
  Weeks.prototype.get = get;
  Weeks.prototype.mapped = mapped;
  Weeks.prototype.mapPartial = mapPartial;
  Weeks.prototype.values = values;
  Weeks.prototype.ofPreposition = _ofPreposition;

  module.exports = Weeks;
})(module);
