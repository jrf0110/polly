var assert = require('assert');

describe('Models', function(){
  describe('Poll', function(){
    var Poll = require('../../models/poll');

    it('.validate() should have no errors', function(){
      var p = Poll.create({
        title: 'Test Poll'
      , choices: [{ title: '1' }, { title: '2' }]
      });

      assert.deepEqual( p.validate(), [] );
    });

    it('.validate() should have INVALID_INPUT error', function(){
      var p = Poll.create({
        title: null
      , choices: [{ title: '1' }, { title: '2' }]
      });

      var errors = p.validate();

      assert.equal( errors.length, 1 );
      assert.equal( errors[0].name, 'INVALID_INPUT' );
    });

    it('.validate() should have INVALID_INPUT error from choice being invalid', function(){
      var p = Poll.create({
        title: 'Test'
      , choices: [{ title: '1' }, {}]
      });

      var errors = p.validate();

      assert.equal( errors.length, 1 );
      assert.equal( errors[0].name, 'INVALID_INPUT' );
    });

    it('.validate() should have TOO_FEW_CHOICES error', function(){
      var p = Poll.create({
        title: 'Test Poll'
      , choices: [{ title: '1' }]
      });

      var errors = p.validate();

      assert.equal( errors.length, 1 );
      assert.equal( errors[0].name, 'TOO_FEW_CHOICES' );
    });
  });

  describe('PollChoice', function(){
    var PollChoice = require('../../models/poll-choice');

    it('.validate()', function(){
      var c = PollChoice.create({ title: 'Blah' });
      var errors = c.validate();
      assert.equal( errors.length, 0 );
    });

    it('.validate() should have INVALID_INPUT error', function(){
      var c = PollChoice.create({});
      var errors = c.validate();
      assert.equal( errors.length, 1 );
      assert.equal( errors[0].name, 'INVALID_INPUT' );
    });
  });

  describe('PollResponse', function(){
    var PollResponse = require('../../models/poll-response/db');

    it('.validatePollRestrictions( callback ) should be valid', function( done ){
      PollResponse({
        poll_choice_id: 2
      , session_id: '1'
      }).validatePollRestrictions( function( error ){
        assert( !error );
        done();
      });
    });

    it('.validatePollRestrictions( callback ) should be invalid because voted_same_thing_twice', function( done ){
      PollResponse({
        poll_choice_id: 1
      , session_id: '1'
      }).validatePollRestrictions( function( error, result ){
        assert( error );
        assert.equal( error.name, 'VOTED_SAME_THING_TWICE' );
        done();
      });
    });

    it.skip('.validatePollRestrictions( callback ) should be invalid because session_vote_count_exceeds_allotment', function( done ){
      PollResponse({
        poll_choice_id: 1
      , session_id: '1'
      }).validatePollRestrictions( function( error, result ){
        assert( error );
        assert.equal( error.name, 'SESSION_VOTE_COUNT_EXCEEDS_ALLOTMENT' );
        done();
      });
    });
  });
});