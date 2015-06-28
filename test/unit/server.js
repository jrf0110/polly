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

  it('GET /api/polls?limit=2&offset=2', function( done ){
    utils.http.get( config.http.baseUrl() + '/api/polls' )
      .query({ limit: 2, offset: 2 })
      .end( function( error, res ){
        assert( !error, error );
        assert.equal( res.body.length, 1 );
        assert.equal( res.body[0].id, 3 );
        done();
      });
  });

  it('GET /api/polls/:id', function( done ){
    utils.http.get( config.http.baseUrl() + '/api/polls/1' )
      .end( function( error, res ){
        assert( !error, error ? JSON.stringify( error, true, '  ' ) : null );
        assert.equal( res.body.id, 1 );
        assert.equal( res.body.title, 'Test Poll 1' );
        done();
      });
  });

  it('POST /api/polls', function( done ){
    utils.http.post( config.http.baseUrl() + '/api/polls' )
      .send({
        title: 'Test Poll'
      , choices: [{ title: 'Choice 1' }, { title: 'Choice 2' }]
      })
      .end( function( error, res ){
        assert( !error, error ? error.message : JSON.stringify( error, true, '  ' ) );
        assert.equal( res.body.id, 4 );
        assert.equal( res.body.title, 'Test Poll' );
        assert.equal( res.body.choices.length, 2 );
        done();
      });
  });

  it('PUT /api/polls/:id', function( done ){
    utils.http.post( config.http.baseUrl() + '/api/polls' )
      .send({ title: 'Test Poll' })
      .end( function( error, res ){
        assert( !error, error ? error.message : JSON.stringify( error, true, '  ' ) );

        var poll = res.body;

        assert.equal( res.body.id, 5 );
        

        done();
      });
  });
});