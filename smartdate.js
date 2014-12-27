(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('smartdate', [], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.smartdate = factory();
  }
}(this, function () {
  'use strict';

  var smartdate = {
    version: '0.7.0',

    config: {
      language: 'en',

      tagName: 'span',

      className: 'smartdate',

      timestampAttr: 'timestamp',

      addTitle: true,

      updateInterval: 5000,

      fullMonthNames: false,

      capitalize: false,

      mode: 'auto'  // also available: 'past', 'future' or 'date'
    }
  };

  var daysBetween = smartdate.daysBetween = function(date1, date2) {
    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()),
        two = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24,
        millisBetween = two.getTime() - one.getTime(),
        days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(days);
  };

  var pad = smartdate.pad = function(n) {
    return n < 10 ? '0' + n : n;
  };

  var formatAMPM = smartdate.formatAMPM = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = pad(minutes);
    return hours + ':' + minutes + ' ' + ampm;
  };

  smartdate.locale = {
    'en': {
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],

      monthsShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],

      dateFormat: function(dt, fullMonthNames) {
        var months = fullMonthNames ? this.months : this.monthsShort;
        return months[dt.getMonth()] + ' ' +
            dt.getDate() + ', ' +
            dt.getFullYear();
      },

      pastFormat: function(date) {
        var now = new Date();
        var sec = (now.getTime() - date.getTime()) / 1000;

        if (sec < 60) {
          return 'less than a minute ago';
        } else if (sec < 60 * 60) {
          return Math.floor(sec / 60) + ' min ago';
        } else if (daysBetween(now, date) === 0) {
          return 'today at ' + formatAMPM(date);
        } else if (daysBetween(now, date) === -1) {
          return 'yesterday at ' + formatAMPM(date);
        }
      },

      futureFormat: function(date) {
        var now = new Date();
        var sec = (date.getTime() - now.getTime()) / 1000;

        if (sec < 60) {
          return 'in less than a minute';
        } else if (sec < 60 * 60) {
          return 'in ' + Math.floor(sec / 60) + ' min';
        } else if (daysBetween(now, date) === 0) {
          return 'today at ' + formatAMPM(date);
        } else if (daysBetween(now, date) === 1) {
          return 'tomorrow at ' + formatAMPM(date);
        }
      }
    },

    'ru': {
      months: [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ],

      monthsShort: [
        'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
        'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
      ],

      dateFormat: function(dt, fullMonthNames) {
        var months = fullMonthNames ? this.months : this.monthsShort;
        return dt.getDate() + ' ' +
            months[dt.getMonth()] + ' ' +
            dt.getFullYear();
      },

      pastFormat: function(date) {
        var now = new Date();
        var sec = (now.getTime() - date.getTime()) / 1000;

        if (sec < 60) {
          return 'менее 1 мин назад';
        } else if (sec < 60 * 60) {
          return Math.floor(sec / 60) + ' мин назад';
        } else if (daysBetween(now, date) === 0) {
          return 'сегодня в ' + pad(date.getHours()) +
              ':' + pad(date.getMinutes());
        } else if (daysBetween(now, date) === -1) {
          return 'вчера в ' + pad(date.getHours()) +
              ':' + pad(date.getMinutes());
        }
      },

      futureFormat: function(date) {
        var now = new Date();
        var sec = (date.getTime() - now.getTime()) / 1000;

        if (sec < 60) {
          return 'в течение минуты';
        } else if (sec < 60 * 60) {
          return 'через ' + Math.floor(sec / 60) + ' мин';
        } else if (daysBetween(now, date) === 0) {
          return 'сегодня в ' + pad(date.getHours()) +
              ':' + pad(date.getMinutes());
        } else if (daysBetween(now, date) === 1) {
          return 'завтра в ' + pad(date.getHours()) +
              ':' + pad(date.getMinutes());
        }
      }
    }
  };

  smartdate.getLocale = function(language) {
    language = language || smartdate.config.language;
    if (typeof language === 'string') {
      language = language.toLowerCase();
      if (smartdate.locale.hasOwnProperty(language)) {
        return smartdate.locale[language];
      }
    }
    return smartdate.locale['en'];
  };

  /**
   * String format of Date object or unix timestamp using current settings
   *
   * @param {Date|number} date - Date object or unix timestamp (in seconds)
   * @return {string|null} - string representation of date made with current
   *                         format and language settings,
   *                         or null if input is incorrect
   */
  smartdate.format = function(date) {
    if (!(date instanceof Date)) {
      date = +date;  // convert to int
      if (isNaN(date)) {
        return null;
      }
      date = new Date(date * 1000);
    }
    var dateText = null,
        locale = smartdate.getLocale(),
        config = smartdate.config,
        nowTimestamp = (new Date()).getTime(),
        timestamp = date.getTime();
    if (config.mode !== 'date') {
      if (config.mode === 'past') {
        timestamp = nowTimestamp - 1;
      } else if (config.mode === 'future') {
        timestamp = nowTimestamp + 1;
      }
      if (timestamp > nowTimestamp) {
        dateText = locale.futureFormat(date);
      } else {
        dateText = locale.pastFormat(date);
      }
    }
    dateText = dateText || locale.dateFormat(date, config.fullMonthNames);
    if (config.capitalize) {
      dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
    }
    return dateText;
  };

  smartdate.render = function() {
    var selector = smartdate.config.tagName + '.' + smartdate.config.className,
        elements = document.querySelectorAll(selector),
        el,
        timestamp,
        date;
    for (var i = 0, l = elements.length; i < l; i++) {
      el = elements[i];
      timestamp = +el.getAttribute('data-' + smartdate.config.timestampAttr);
      date = new Date(timestamp * 1000);
      el.innerHTML = smartdate.format(date);
      if (smartdate.config.addTitle) {
        el.setAttribute('title', date.toLocaleString());
      }
    }
  };

  smartdate.setup = function(options) {
    options = options || {};
    for (var o in options) {
      if (options.hasOwnProperty(o)) {
        smartdate.config[o] = options[o];
      }
    }
  };

  smartdate.init = function(options) {
    smartdate.setup(options);
    smartdate.render();
    if (smartdate.config.updateInterval) {
      window.setInterval(smartdate.render, smartdate.config.updateInterval);
    }
  };

  return smartdate;
}));
