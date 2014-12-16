/* global define */
(function(window) {
  'use strict';

  var smartdate = {
    version: '0.3.0',

    config: {
      language: 'en',

      tagName: 'span',

      className: 'smartdate',

      timestampAttr: 'timestamp',

      addTitle: true,

      updateInterval: 5000
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
      dateFormat: function(dt) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[dt.getMonth()] + ' ' +
            dt.getDate() + ', ' +
            dt.getFullYear();
      },

      sinceNow: function(date) {
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
      }
    },

    'ru': {
      dateFormat: function(dt) {
        var months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн',
                      'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        return dt.getDate() + ' ' +
            months[dt.getMonth()] + ' ' +
            dt.getFullYear();
      },

      sinceNow: function(date) {
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
      }
    }
  };

  smartdate.getLocale = function(language) {  // 'en' is default
    if (typeof language === 'string') {
      language = language.toLowerCase();
      if (smartdate.locale.hasOwnProperty(language)) {
        return smartdate.locale[language];
      }
    }
    return smartdate.locale['en'];
  };

  smartdate.sinceNow = function(date, language) {  // language is optional
    return smartdate.getLocale(language).sinceNow(date);
  };

  smartdate.dateFormat = function(date, language) {  // language is optional
    return smartdate.getLocale(language).dateFormat(date);
  };

  smartdate.removeClass = function(el, className) {  // Works in IE8+
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(
          new RegExp('(^|\\b)' +
              className.split(' ').join('|') +
              '(\\b|$)', 'gi'), ' '
      );
    }
  };

  smartdate.render = function() {
    var language = smartdate.config.language,
        selector = smartdate.config.tagName + '.' + smartdate.config.className,
        elements = document.querySelectorAll(selector);
    Array.prototype.forEach.call(elements, function(el) {
      var timestamp = el.getAttribute('data-' + smartdate.config.timestampAttr),
          date = new Date(timestamp * 1000);

      var dateText = smartdate.sinceNow(date, language);
      if (!dateText) {
        dateText = smartdate.dateFormat(date, language);
        smartdate.removeClass(el, smartdate.config.className);
      }

      el.innerHTML = dateText;
      if (smartdate.config.addTitle) {
        el.setAttribute('title', date.toLocaleString());
      }
    });
  };

  smartdate.init = function(options) {
    options = options || {};
    for (var o in options) {
      if (options.hasOwnProperty(o)) {
        smartdate.config[o] = options[o];
      }
    }
    smartdate.render();
    if (smartdate.config.updateInterval) {
      window.setInterval(smartdate.render, smartdate.config.updateInterval);
    }
  };

  if (typeof define === 'function' && define.amd) {
    define('smartdate', [], function() {
      return smartdate;
    });
  } else {
    window.smartdate = smartdate;
  }

})(window);
