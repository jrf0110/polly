var assert  = require('assert');
var utils   = require('../../lib/utils');
var config  = require('../../config');

describe('Server', function(){
  it('GET /api/polls', function( done ){
    utils.http.get( config.http.baseUrl() + '/api/polls' )
      .end( function( error, res ){
        assert( !error, error );
        assert( res.body.length > 0 );
        assert.equal( res.body[0].id, 1 );
        assert.equal( res.body[0].title, 'Test Poll 1' );
        done();
      });
  });

  it('GET /api/polls/:id', function( done ){
    utils.http.get( config.http.baseUrl() + '/api/polls/1' )
      .end( function( error, res ){
        assert( !error );
        assert( res.body.length > 0 );
        assert.equal( res.body.id, 1 );
        assert.equal( res.body.title, 'Test Poll 1' );
        done();
      });
  });
});