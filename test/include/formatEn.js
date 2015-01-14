'use strict';

var assert = require('assert');

module.exports = function(smartdate){
  var format = smartdate.format;

  it('should return null if input is incorrect', function(){
    var inputs = [
      undefined, '42lol', true, false, null, {}, [], function(){ return 1; }
    ];
    for (var i = 0, l = inputs.length; i < l; i++) {
      var result = format(inputs[l]);
      assert.strictEqual(
          result, null, 'format(wrongInputs[' + l + ']) -> ' + result);
    }
  });

  it('should accept dates given as Unix timestamp', function(){
    assert.strictEqual(format(0), 'Jan 1, 1970');
    assert.strictEqual(format(100000), 'Jan 2, 1970');
    assert.strictEqual(format('0'), 'Jan 1, 1970');
    assert.strictEqual(format(-10000), 'Dec 31, 1969');
    assert.strictEqual(format('-10000'), 'Dec 31, 1969');
    assert.strictEqual(format('+100000'), 'Jan 2, 1970');
  });

  function testPast() {
    var date = smartdate.now(),
        parts,
        hours,
        month,
        day,
        year;
    assert.strictEqual(format(date), 'less than a minute ago');
    date.setMinutes(date.getMinutes() - 1);
    assert.strictEqual(format(date), '1 min ago');
    date.setMinutes(date.getMinutes() - 1);
    assert.strictEqual(format(date), '2 min ago');
    date.setMinutes(date.getMinutes() - 57);
    assert.strictEqual(format(date), '59 min ago');
    date.setMinutes(date.getMinutes() - 1);
    hours = date.getHours() % 12 || 12;
    assert(format(date).indexOf('today at ' + hours + ':') === 0);
    date.setHours(-1);
    assert(format(date).indexOf('yesterday at 11:') === 0);  // pm
    date.setHours(12);
    assert(format(date).indexOf('yesterday at 12:') === 0);  // pm
    date.setHours(0);
    assert(format(date).indexOf('yesterday at 12:') === 0);  // am
    date.setHours(-1);
    parts = date.toString().split(' ');
    month = parts[1];
    day = parts[2];
    year = parts[3];
    assert.strictEqual(format(date), month + ' ' + day + ', ' + year);
    assert.strictEqual(format(new Date(2000, 11, 31)), 'Dec 31, 2000');
  }

  function testFuture() {
    var date = smartdate.now(),
        parts,
        hours,
        month,
        day,
        year;
    date.setSeconds(date.getSeconds() + 5);
    assert.strictEqual(format(date), 'in less than a minute');
    date.setMinutes(date.getMinutes() + 1);
    assert.strictEqual(format(date), 'in 1 min');
    date.setMinutes(date.getMinutes() + 1);
    assert.strictEqual(format(date), 'in 2 min');
    date.setMinutes(date.getMinutes() + 57);
    assert.strictEqual(format(date), 'in 59 min');
    date.setMinutes(date.getMinutes() + 1);
    hours = date.getHours() % 12 || 12;
    assert(format(date).indexOf('today at ' + hours + ':') === 0);
    date.setHours(24);
    assert(format(date).indexOf('tomorrow at 12:') === 0);  // am
    date.setHours(12);
    assert(format(date).indexOf('tomorrow at 12:') === 0);  // pm
    date.setHours(23);
    assert(format(date).indexOf('tomorrow at 11:') === 0);  // pm
    date.setHours(24);
    parts = date.toString().split(' ');
    month = parts[1];
    day = parts[2];
    year = parts[3];
    assert.strictEqual(format(date), month + ' ' + day + ', ' + year);
    assert.strictEqual(format(new Date(2100, 7, 1)), 'Aug 1, 2100');
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
    assert.strictEqual(format(date), almostNow);
    date.setMinutes(date.getMinutes() + 1);
    assert.strictEqual(format(date), almostNow);
    date.setHours(date.getHours() + 1);
    assert.strictEqual(format(date), almostNow);
    date.setHours(date.getHours() + 24);
    assert.strictEqual(format(date), almostNow);
    date.setHours(date.getHours() + 24 * 100);
    assert.strictEqual(format(date), almostNow);
  });

  it('should block past dates when in "future" mode', function(){
    smartdate.setup({mode: 'future'});
    testFuture();
    var almostNow = 'in less than a minute',
        date = smartdate.now();
    assert.strictEqual(format(date), almostNow);
    date.setMinutes(date.getMinutes() - 1);
    assert.strictEqual(format(date), almostNow);
    date.setHours(date.getHours() - 1);
    assert.strictEqual(format(date), almostNow);
    date.setHours(date.getHours() - 24);
    assert.strictEqual(format(date), almostNow);
    date.setHours(date.getHours() - 24 * 100);
    assert.strictEqual(format(date), almostNow);
  });

  it('should return only dates when in "date" mode', function(){
    var date = smartdate.now(),
        parts = date.toString().split(' '),
        todayStr = parts[1] + ' ' + parts[2] + ', ' + parts[3];
    smartdate.setup({mode: 'date'});
    assert.strictEqual(format(date), todayStr);
    date.setMinutes(date.getMinutes() - 1);
    assert.strictEqual(format(date), todayStr);
    date.setHours(date.getHours() - 1);
    assert.strictEqual(format(date), todayStr);
    date = smartdate.now();
    date.setMinutes(date.getMinutes() + 1);
    assert.strictEqual(format(date), todayStr);
    date.setHours(date.getHours() + 1);
    assert.strictEqual(format(date), todayStr);
  });

};
