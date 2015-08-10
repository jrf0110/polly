var assert  = require('assert');
var utils   = require('../../lib/utils');
var config  = require('../../config');
var db      = require('../../db');

describe('DB', function(){
  it('has_voted, multipleSessionsPerIp: false, should be true', function( done ){
    var options = {
      hasVoted: {
        user_ip: '127.0.0.1'
      , session_id: '1'
      }
    };

    db.polls.findOne( 1, options, function( error, poll ){
      if ( error ){
        return done( error );
      }

      // assert.equal( poll.has_voted, true );
      assert.deepEqual( poll.session_responses, [1] );

      done();
    });
  });

  it('has_voted, multipleSessionsPerIp: false, should be true', function( done ){
    var options = {
      hasVoted: {
        user_ip: '127.0.0.1'
      , session_id: '2'
      }
    };

    db.polls.findOne( 1, options, function( error, poll ){
      if ( error ){
        return done( error );
      }

      // assert.equal( poll.has_voted, true );
      assert.deepEqual( poll.session_responses, [1] );

      done();
    });
  });

  it('has_voted, multipleSessionsPerIp: false, should be false', function( done ){
    var options = {
      hasVoted: {
        user_ip: '192.168.1.1'
      , session_id: '1'
      }
    };

    db.polls.findOne( 1, options, function( error, poll ){
      if ( error ){
        return done( error );
      }

      // assert.equal( poll.has_voted, false );
      assert.deepEqual( poll.session_responses, [] );

      done();
    });
  });

  it('has_voted, multipleSessionsPerIp: true, should be false', function( done ){
    var options = {
      hasVoted: {
        user_ip: '127.0.0.1'
      , session_id: '1'
      }
    };

    db.polls.findOne( 2, options, function( error, poll ){
      if ( error ){
        return done( error );
      }

      // assert.equal( poll.has_voted, false );
      assert.deepEqual( poll.session_responses, [] );

      done();
    });
  });

  it('has_voted, multipleSessionsPerIp: true, should be true', function( done ){
    var options = {
      hasVoted: {
        user_ip: '127.0.0.1'
      , session_id: '2'
      }
    };

    db.polls.findOne( 2, options, function( error, poll ){
      if ( error ){
        return done( error );
      }

      // assert.equal( poll.has_voted, true );
      assert.deepEqual( poll.session_responses, [4] );

      done();
    });
  });
});