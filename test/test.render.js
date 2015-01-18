'use strict';

var expect = require('expect.js'),
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
      var el,
          timestamp = 947765593,
          date = new Date(timestamp * 1000);
      testArea.appendChild(smartdate.tag(date));
      el = testArea.childNodes[0];
      expect(el.tagName.toLowerCase()).to.equal('span');
      expect(el.className).to.equal('smartdate');
      expect(el.getAttribute('data-timestamp')).to.eql(timestamp);
      expect(el.innerHTML).to.equal('');
      smartdate.render();
      expect(el.innerHTML).to.equal('Jan 13, 2000');
    });

  });

});
