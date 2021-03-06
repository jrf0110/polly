import Poll from '../models/poll/db';
import dispatcher from '../lib/dispatcher';

module.exports.fetchPollById = function( id ){
  Poll
    .create({ id: id })
    .fetch( function( error, poll ){
      if ( error ){
        return dispatcher.dispatch({
          type: 'RECEIVE_ERROR'
        , error: error
        });
      }

      return dispatcher.dispatch({
        type: 'RECEIVE_POLL'
      , poll: poll
      });
    });
};