'use strict';

var assert = require('assert'),
    smartdate = require('../smartdate');

describe('smartdate', function(){
  var testArea;

  before(function(){
    testArea = document.createElement('div');
    document.body.appendChild(testArea);
  });

  beforeEach(function(){
    testArea.innerHTML = '';
  });

  describe('render()', function(){

    it('should render a tag correctly with default settings', function(){
      testArea.appendChild(smartdate.tag(new Date(2000, 0, 13, 13, 13, 13)));
      assert.strictEqual(
          testArea.innerHTML,
          '<span class="smartdate" data-timestamp="947765593"></span>');
      smartdate.render();
      assert.strictEqual(
          document.querySelector('span.smartdate').innerHTML,
          'Jan 13, 2000');
    });

  });

});
