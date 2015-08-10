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

    describe('SessionResponses', function(){
      it('.addSessionResponse()', function(){
        var p = Poll.create();
        p.addSessionResponse(1);
        assert.deepEqual( p.pending_session_responses, [1] );
      });

      it('.removeSessionResponse()', function(){
        var p = Poll.create();
        p.addSessionResponse(3);
        p.removeSessionResponse(1);
        assert.deepEqual( p.pending_session_responses, [3] );
        p.removeSessionResponse(3);
        assert.deepEqual( p.pending_session_responses, [] );
      });

      it('.hasSessionResponse()', function(){
        var p = Poll.create();
        p.addSessionResponse(3);
        assert( p.hasSessionResponse(3) );
        assert( !p.hasSessionResponse(2) );
      });

      it('.doneVoting()', function(){
        var p = Poll.create();
        p.session_responses.push(1);
        assert( p.doneVoting() );
      });

      it('.hasMetMaximumNumberOfVotes()', function(){
        var p = Poll.create({
          options: { numberOfVotesPerPoll: 2 }
        });

        p.addSessionResponse(3);
        assert( !p.hasMetMaximumNumberOfVotes() );

        p.addSessionResponse(4);
        assert( p.hasMetMaximumNumberOfVotes() );
      });
    });

    describe('Stats', function(){
      it('.getTotalVotes()', function(){
        var p = Poll.create({
          stats: {
            responses: {
              1: 5
            , 2: 10
            , 3: 0
            , 4: 20
            }
          }
        });

        assert.equal( p.getTotalVotes(), 35 );
      });
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