/**
 * Session Responses
 */

var utils         = require('../../lib/utils');
var PollResponse  = require('../poll-response/db');

module.exports = require('stampit')()
  .state({
    // Where the session/user's votes are stored after persisting
    // Informs whether or not the user has interacted with this poll
    session_responses:          []

    // Where votes are held prior to persisting
    // Should inform the UI while voting (before clicking submit)
  , pending_session_responses:  []
  })
  .methods({
    addSessionResponse: function( choiceId ){
      if ( this.pending_session_responses.indexOf( choiceId ) > -1 ) return this;

      this.pending_session_responses.push( choiceId );

      return this;
    }

  , removeSessionResponse: function( choiceId ){
      this.pending_session_responses = this.pending_session_responses.filter( function( id ){
        return id != choiceId;
      });

      return this;
    }

  , hasSessionResponse: function( choiceId ){
      return this.pending_session_responses.indexOf( choiceId ) > -1;
    }

  , saveSessionResponses: function( userIp, sessionId, callback ){
      if ( typeof userIp === 'function' ){
        callback = userIp;
        userIp = null;
        sessionId = null;
      }

      this.is_saving = true;

      var onSessionResponse = function( choiceId, done ){
        return PollResponse
          .create({
            user_ip:        userIp
          , session_id:     sessionId
          , poll_choice_id: choiceId
          , poll_id:        this.id
          })
          .save( done );
      }.bind( this );

      utils.async.each( this.pending_session_responses, onSessionResponse, ( error )=>{
        this.is_saving = false;
        this.session_responses = this.pending_session_responses;
        this.pending_session_responses = [];

        return callback( error, this );
      });

      return this;
    }

  , isSaving: function(){
      return this.is_saving;
    }

  , doneVoting: function(){
      return this.session_responses.length >= this.options.numberOfVotesPerPoll;
    }

  , hasMetMaximumNumberOfVotes: function(){
      return [
        !this.doneVoting()
      , this.pending_session_responses.length >= this.options.numberOfVotesPerPoll
      ].every( utils.identity );
    }
  });