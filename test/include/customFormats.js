'use strict';

var expect = require('expect.js');

module.exports = function(smartdate){
  var format = smartdate.format;

  it('should support new custom formats', function(){
    var date = new Date(2000, 0, 13, 14, 15, 16);
    smartdate.setup({mode: 'special', fullMonthNames: true});
    // when special format is undefined, we expect fallback to auto mode
    expect(format(date)).to.equal('January 13, 2000');

    // define new custom format
    smartdate.locale.en.special = function(date, fullMonthNames) {
      return this.date(date, fullMonthNames) + ' | ' + this.time(date);
    };

    // make sure it is working
    expect(format(date)).to.equal('January 13, 2000 | 2:15 pm');
  });

  it('should allow to overwrite built-in formats', function(){
    var date = new Date(2000, 0, 13, 14, 15, 16);
    smartdate.setup({locale: 'ru', mode: 'datetime'});
    expect(format(date)).to.equal('13 янв 2000 в 14:15');

    // overwrite time in russian locale - display time with seconds
    smartdate.locale.ru.originalTime = smartdate.locale.ru.time;
    smartdate.locale.ru.time = function(date) {
      return this.originalTime(date) + ':' + smartdate.pad(date.getSeconds());
    };

    // make sure it is working
    expect(format(date)).to.equal('13 янв 2000 в 14:15:16');
  });

};
