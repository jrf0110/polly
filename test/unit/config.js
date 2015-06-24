var assert  = require('assert');
var utils   = require('../../lib/utils');
var config  = require('../../config');

describe('Config', function(){
  it('http.baseUrl()', function(){
    assert.equal( config.http.baseUrl(), 'http://localhost:3063' );
  });
});