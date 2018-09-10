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
    version: '0.9.1',

    config: {
      locale: 'en',

      tagName: 'span',

      className: 'smartdate',

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

  smartdate.now = function() {
    return new Date();
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

      date: function(date, fullMonthNames) {
        var months = fullMonthNames ? this.months : this.monthsShort;
        return months[date.getMonth()] + ' ' +
            date.getDate() + ', ' +
            date.getFullYear();
      },

      time: function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = pad(minutes);
        return hours + ':' + minutes + ' ' + ampm;
      },

      datetime: function(date, fullMonthNames) {
        return this.date(date, fullMonthNames) + ' at ' + this.time(date);
      },

      past: function(date, fullMonthNames) {
        var now = smartdate.now();
        var sec = (now.getTime() - date.getTime()) / 1000;

        if (sec < 60) {
          return 'less than a minute ago';
        } else if (sec < 60 * 60) {
          return Math.floor(sec / 60) + ' min ago';
        } else if (daysBetween(now, date) === 0) {
          return 'today at ' + this.time(date);
        } else if (daysBetween(now, date) === -1) {
          return 'yesterday at ' + this.time(date);
        }
        return this.date(date, fullMonthNames);
      },

      future: function(date, fullMonthNames) {
        var now = smartdate.now();
        var sec = (date.getTime() - now.getTime()) / 1000;

        if (sec < 60) {
          return 'in less than a minute';
        } else if (sec < 60 * 60) {
          return 'in ' + Math.floor(sec / 60) + ' min';
        } else if (daysBetween(now, date) === 0) {
          return 'today at ' + this.time(date);
        } else if (daysBetween(now, date) === 1) {
          return 'tomorrow at ' + this.time(date);
        }
        return this.date(date, fullMonthNames);
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

      date: function(date, fullMonthNames) {
        var months = fullMonthNames ? this.months : this.monthsShort;
        return date.getDate() + ' ' +
            months[date.getMonth()] + ' ' +
            date.getFullYear();
      },

      time: function(date) {
        return pad(date.getHours()) + ':' + pad(date.getMinutes());
      },

      datetime: function(date, fullMonthNames) {
        return this.date(date, fullMonthNames) + ' в ' + this.time(date);
      },

      past: function(date, fullMonthNames) {
        var now = smartdate.now();
        var sec = (now.getTime() - date.getTime()) / 1000;

        if (sec < 60) {
          return 'менее 1 мин назад';
        } else if (sec < 60 * 60) {
          return Math.floor(sec / 60) + ' мин назад';
        } else if (daysBetween(now, date) === 0) {
          return 'сегодня в ' + this.time(date);
        } else if (daysBetween(now, date) === -1) {
          return 'вчера в ' + this.time(date);
        }
        return this.date(date, fullMonthNames);
      },

      future: function(date, fullMonthNames) {
        var now = smartdate.now();
        var sec = (date.getTime() - now.getTime()) / 1000;

        if (sec < 60) {
          return 'в течение минуты';
        } else if (sec < 60 * 60) {
          return 'через ' + Math.floor(sec / 60) + ' мин';
        } else if (daysBetween(now, date) === 0) {
          return 'сегодня в ' + this.time(date);
        } else if (daysBetween(now, date) === 1) {
          return 'завтра в ' + this.time(date);
        }
        return this.date(date, fullMonthNames);
      }
    }
  };

  smartdate.getLocale = function(locale) {
    locale = locale || smartdate.config.locale;
    if (typeof locale === 'string') {
      locale = locale.toLowerCase();
      if (smartdate.locale.hasOwnProperty(locale)) {
        return smartdate.locale[locale];
      }
    }
    return smartdate.locale['en'];
  };

  smartdate.getOptions = function(options) {
    options = options || {};
    for (var o in smartdate.config) {
      if (smartdate.config.hasOwnProperty(o) && !options.hasOwnProperty(o)) {
        options[o] = smartdate.config[o];
      }
    }
    return options;
  };

  smartdate.auto = function(locale, date, fullMonthNames) {
    if (date.getTime() > smartdate.now().getTime()) {
      return locale.future(date, fullMonthNames);
    } else {
      return locale.past(date, fullMonthNames);
    }
  };

  /**
   * String format of Date object or unix timestamp using current settings
   *
   * @param {Date|number} date - Date object or unix timestamp (in seconds)
   * @param {object} options - optional, object with configuration options
   * @return {string|null} - string representation of date made with current
   *                         format and locale settings,
   *                         or null if input is incorrect
   */
  smartdate.format = function(date, options) {
    if (!(date instanceof Date)) {
      if (typeof date === 'string') {
        date = Number(date);
      }
      if (typeof date !== 'number' || isNaN(date)) {
        return null;
      }
      date = new Date(date * 1000);
    }
    options = smartdate.getOptions(options);
    var dateText,
        locale = smartdate.getLocale(options.locale);
    if (!(options.mode && typeof locale[options.mode] === 'function')) {
      // default is auto mode
      dateText = smartdate.auto(locale, date, options.fullMonthNames);
    } else {
      dateText = locale[options.mode](date, options.fullMonthNames);
    }
    if (options.capitalize) {
      dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
    }
    return dateText;
  };

  smartdate.render = function() {
    var config = smartdate.config,
        date,
        selector = config.tagName + '.' + config.className,
        elements = document.querySelectorAll(selector),
        el,
        options,
        optionValue,
        timestamp;
    for (var i = 0, l = elements.length; i < l; i++) {
      el = elements[i];
      timestamp = +el.getAttribute('data-timestamp');

      // extract custom options from data-attributes
      options = {};
      for (var o in config) {
        if (config.hasOwnProperty(o) && el.hasAttribute('data-' + o)) {
          optionValue = el.getAttribute('data-' + o).toLowerCase();
          if (typeof config[o] === 'boolean') {
            optionValue = (optionValue === 'true');
          }
          options[o] = optionValue;
        }
      }
      options = smartdate.getOptions(options);

      date = new Date(timestamp * 1000);
      el.innerHTML = smartdate.format(date, options);
      if (options.addTitle) {
        el.setAttribute('title', date.toLocaleString());
      }
    }
  };

  smartdate.setup = function(options) {
    smartdate.config = smartdate.getOptions(options);
  };

  smartdate.init = function(options) {
    smartdate.setup(options);
    smartdate.render();
    if (smartdate.config.updateInterval) {
      window.setInterval(smartdate.render, smartdate.config.updateInterval);
    }
  };

  smartdate.tag = function(date, options) {
    var tag,
        timestamp;
    if (date instanceof Date) {
      timestamp = Math.round(date.getTime() / 1000);
    } else {
      // assuming unix timestamp in seconds
      timestamp = date;
      date = new Date(timestamp * 1000);
    }
    tag = document.createElement(smartdate.config.tagName);
    tag.className = smartdate.config.className;
    tag.setAttribute('data-timestamp', timestamp);
    options = smartdate.getOptions(options);
    tag.innerHTML = smartdate.format(date, options);
    if (options.addTitle) {
      tag.setAttribute('title', date.toLocaleString());
    }
    return tag;
  };

  return smartdate;
}));
