'use strict';

var customFormats = require('./include/customFormats'),
    merge = require('merge'),
    smartdate = require('../smartdate'),
    formatEn = require('./include/formatEn'),
    formatRu = require('./include/formatRu');

describe('smartdate', function(){
  describe('format()', function(){

    var originalConfig,
        originalLocale,
        originalNow;

    before(function(){
      // save default config and locale
      originalConfig = merge({}, smartdate.config);
      originalLocale = merge({}, smartdate.locale);
      // mock and freeze now(), so tests always run in the same conditions
      originalNow = smartdate.now;
      smartdate.now = function() {
        return new Date(2015, 0, 13, 13, 13, 13);
      };
    });

    beforeEach(function(){
      // restore default config
      smartdate.config = merge({}, originalConfig);
      smartdate.locale = merge({}, originalLocale);
    });

    after(function(){
      // restore everything
      smartdate.now = originalNow;
      smartdate.config = merge({}, originalConfig);
      smartdate.locale = merge({}, originalLocale);
    });

    describe('locale: "en"', function(){
      formatEn(smartdate);
    });

    describe('locale: "ru"', function(){
      beforeEach(function(){
        smartdate.setup({locale: 'ru'});
      });
      formatRu(smartdate);
    });

    describe('custom formats', function(){
      customFormats(smartdate);
    });

  });
});
