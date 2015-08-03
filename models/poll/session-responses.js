/**
 * 
 */

var utils           = require('../../lib/utils');
var SessionResponse = require('../poll-response/db');

module.exports = require('stampit')()
  .state({
    session_responses: []
  })
  .methods({
    addSessionResponse: function( choiceId ){
      if ( this.session_responses.indexOf( choiceId ) > -1 ) return this;

      this.session_responses.push( choiceId );

      return this;
    }

  , removeSessionResponse: function( choiceId ){
      this.session_responses = this.session_responses.filter( function( id ){
        return id != choiceId;
      });

      return this;
    }

  , hasSessionResponse: function( choiceId ){
      return this.session_responses.indexOf( choiceId ) > -1;
    }

  , saveSessionResponses: function( userIp, sessionId, callback ){
      if ( typeof userIp === 'function' ){
        callback = userIp;
        userIp = null;
        sessionId = null;
      }

      var onSessionResponse = function( choiceId, done ){
        return SessionResponse
          .create({
            user_ip:    userIp
          , session_id: sessionId
          , choice_id:  choiceId
          , poll_id:    this.id
          })
          .save( done );
      };

      utils.async.each( this.session_responses, onSessionResponse, callback );

      return this;
    }
  });