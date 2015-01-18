'use strict';

var expect = require('expect.js');

module.exports = function(smartdate){
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      format = smartdate.format;

  function shortDateFormat(d) {
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  it('should return null if input is incorrect', function(){
    var inputs = [
      undefined, '42lol', true, false, null, {}, [], function(){ return 1; }
    ];
    for (var i = 0, l = inputs.length; i < l; i++) {
      var result = format(inputs[l]);
      expect(result).to.equal(null);
    }
  });

  it('should accept dates given as Unix timestamp', function(){
    var d = new Date(0);
    expect(format(0)).to.equal(shortDateFormat(d));
    expect(format('0')).to.equal(shortDateFormat(d));
    d = new Date(100000 * 1000);
    expect(format(100000)).to.equal(shortDateFormat(d));
    expect(format('+100000')).to.equal(shortDateFormat(d));
    d = new Date(-10000 * 1000);
    expect(format(-10000)).to.equal(shortDateFormat(d));
    expect(format('-10000')).to.equal(shortDateFormat(d));
  });

  function testPast() {
    var date = smartdate.now(),
        hours;
    expect(format(date)).to.equal('less than a minute ago');
    date.setMinutes(date.getMinutes() - 1);
    expect(format(date)).to.equal('1 min ago');
    date.setMinutes(date.getMinutes() - 1);
    expect(format(date)).to.equal('2 min ago');
    date.setMinutes(date.getMinutes() - 57);
    expect(format(date)).to.equal('59 min ago');
    date.setMinutes(date.getMinutes() - 1);
    hours = date.getHours() % 12 || 12;
    expect(format(date).indexOf('today at ' + hours + ':')).to.equal(0);
    date.setHours(-1);
    expect(format(date).indexOf('yesterday at 11:')).to.equal(0);  // pm
    date.setHours(12);
    expect(format(date).indexOf('yesterday at 12:')).to.equal(0);  // pm
    date.setHours(0);
    expect(format(date).indexOf('yesterday at 12:')).to.equal(0);  // am
    date.setHours(-1);
    expect(format(date)).to.equal(shortDateFormat(date));
    expect(format(new Date(2000, 11, 31))).to.equal('Dec 31, 2000');
  }

  function testFuture() {
    var date = smartdate.now(),
        hours;
    date.setSeconds(date.getSeconds() + 5);
    expect(format(date)).to.equal('in less than a minute');
    date.setMinutes(date.getMinutes() + 1);
    expect(format(date)).to.equal('in 1 min');
    date.setMinutes(date.getMinutes() + 1);
    expect(format(date)).to.equal('in 2 min');
    date.setMinutes(date.getMinutes() + 57);
    expect(format(date)).to.equal('in 59 min');
    date.setMinutes(date.getMinutes() + 1);
    hours = date.getHours() % 12 || 12;
    expect(format(date).indexOf('today at ' + hours + ':')).to.equal(0);
    date.setHours(24);
    expect(format(date).indexOf('tomorrow at 12:')).to.equal(0);  // am
    date.setHours(12);
    expect(format(date).indexOf('tomorrow at 12:')).to.equal(0);  // pm
    date.setHours(23);
    expect(format(date).indexOf('tomorrow at 11:')).to.equal(0);  // pm
    date.setHours(24);
    expect(format(date)).to.equal(shortDateFormat(date));
    expect(format(new Date(2100, 7, 1))).to.equal('Aug 1, 2100');
  }

  it('should have "auto" mode working as described in docs', function(){
    // auto should be a default mode setting
    testPast();
    testFuture();
    // auto should work when specified explicitly
    smartdate.setup({mode: 'auto'});
    testPast();
    testFuture();
    // incorrect mode setting should be interpreted as auto
    smartdate.setup({mode: 'lol'});
    testPast();
    testFuture();
  });

  it('should block future dates when in "past" mode', function(){
    smartdate.setup({mode: 'past'});
    testPast();
    var almostNow = 'less than a minute ago',
        date = smartdate.now();
    expect(format(date)).to.equal(almostNow);
    date.setMinutes(date.getMinutes() + 1);
    expect(format(date)).to.equal(almostNow);
    date.setHours(date.getHours() + 1);
    expect(format(date)).to.equal(almostNow);
    date.setHours(date.getHours() + 24);
    expect(format(date)).to.equal(almostNow);
    date.setHours(date.getHours() + 24 * 100);
    expect(format(date)).to.equal(almostNow);
  });

  it('should block past dates when in "future" mode', function(){
    smartdate.setup({mode: 'future'});
    testFuture();
    var almostNow = 'in less than a minute',
        date = smartdate.now();
    expect(format(date)).to.equal(almostNow);
    date.setMinutes(date.getMinutes() - 1);
    expect(format(date)).to.equal(almostNow);
    date.setHours(date.getHours() - 1);
    expect(format(date)).to.equal(almostNow);
    date.setHours(date.getHours() - 24);
    expect(format(date)).to.equal(almostNow);
    date.setHours(date.getHours() - 24 * 100);
    expect(format(date)).to.equal(almostNow);
  });

  it('should return only dates when in "date" mode', function(){
    var date = smartdate.now(),
        todayStr = shortDateFormat(date);
    smartdate.setup({mode: 'date'});
    expect(format(date)).to.equal(todayStr);
    date.setMinutes(date.getMinutes() - 1);
    expect(format(date)).to.equal(todayStr);
    date.setHours(date.getHours() - 1);
    expect(format(date)).to.equal(todayStr);
    date = smartdate.now();
    date.setMinutes(date.getMinutes() + 1);
    expect(format(date)).to.equal(todayStr);
    date.setHours(date.getHours() + 1);
    expect(format(date)).to.equal(todayStr);
  });

};
