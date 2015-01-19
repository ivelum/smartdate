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
          date = new Date(timestamp * 1000),
          dateStr = 'Jan 13, 2000';
      testArea.appendChild(smartdate.tag(date));
      el = testArea.childNodes[0];
      expect(el.tagName.toLowerCase()).to.equal('span');
      expect(el.className).to.equal('smartdate');
      expect(el.getAttribute('data-timestamp')).to.eql(timestamp);
      expect(el.innerHTML).to.equal(dateStr);
      expect(el.getAttribute('title')).to.equal(date.toLocaleString());
      el.innerHTML = '';
      el.setAttribute('title', '');
      expect(el.innerHTML).to.equal('');
      expect(el.getAttribute('title')).to.equal('');
      smartdate.render();
      expect(el.innerHTML).to.equal(dateStr);
      expect(el.getAttribute('title')).to.equal(date.toLocaleString());
    });

    it('should accept configuration options in data-attributes', function(){
      var el;
      testArea.innerHTML = '<span class="smartdate" ' +
          'data-timestamp="947765593" ' +
          'data-locale="RU" ' +
          'data-Mode="future" ' +
          'data-cApiTalize="True" ' +
          'data-addTitle="false" ' +
          '></span>';
      smartdate.render();
      el = testArea.childNodes[0];
      expect(el.innerHTML).to.equal('В течение минуты');
      expect(el.getAttribute('title')).to.not.be.ok();
    });

  });

});
