'use strict';

var merge = require('merge'),
    smartdate = require('../smartdate'),
    formatEn = require('./include/formatEn');

describe('smartdate', function(){
  describe('format()', function(){

    var originalConfig,
        originalNow;

    before(function(){
      // save default config
      originalConfig = merge({}, smartdate.config);
      // mock and freeze now(), so tests always run in the same conditions
      originalNow = smartdate.now;
      smartdate.now = function() {
        return new Date(2015, 0, 13, 13, 13, 13);
      };
    });

    beforeEach(function(){
      // restore default config
      smartdate.config = merge({}, originalConfig);
    });

    after(function(){
      // restore now() and config
      smartdate.now = originalNow;
      smartdate.config = merge({}, originalConfig);
    });

    formatEn(smartdate);

  });
});