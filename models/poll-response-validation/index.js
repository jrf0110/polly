var utils = require('../../lib/utils');
var db    = require('../../db');

var parseRes = function( res ){
  var fields = [
    'voted_same_thing_twice'
  ];

  var row = res.rows[0];

  return {
    valid:  fields.reduce( function( curr, field ){
              return curr && !row[ field ];
            }, true )
  , why:    row
  };
};

module.exports = require('stampit')()
  .enclose( function(){
    if ( !this.session_id ){
      throw new Error('session_id required');
    }

    if ( !this.poll_choice_id ){
      throw new Error('poll_choice_id required');
    }
  })
  .methods({
    /**
     * Check to see if the response is valid given the options
     * of the poll
     *   - Ensure session_id/choice_id does not exist
     *   - Ensure number of session_id/poll_id < options.numberOfVotesPerSession
     *   - If !options.multipleSessionsPerIp
     *      - Ensure session_id/poll_id does not exist
     * @param  {Function}     callback  callback( error, Boolean result )
     * 
     * @object result {
     *   value: Boolean
     * , why: {
     *     voted_same_thing_twice: Boolean
     *   }
     * }
     */
    validate: function( callback ){
      var query = Object.create({
        type: 'select'
      , columns: []

      , add: function( name, expression ){
          this.columns.push({ type: 'expression'
          , alias: name
          , expression: {
              parenthesis: true
            , expression: {
                type: 'select'
              , columns: [{
                  type: 'exists'
                , expression: expression
                }]
              }
            }
          });

          return this;
        }
      });

      query
        .add( 'voted_same_thing_twice', {
          type:   'select'
        , table:  'poll_responses'
        , where:  utils.pick( this, 'session_id', 'poll_choice_id' )
        })
        /*.add( 'session_vote_count_exceeds_allotment', {
          type:   'select'
        , columns: [{ expression: '1' }]
        , table:  'poll_responses'
        , joins:  [ { type: 'left', target: 'poll_choices'
                    , on: { 'poll_responses.poll_choice_id': '$poll_choices.id$' } }
                  , { type: 'left', target: 'polls'
                    , on: { 'polls.id': '$poll_choices.poll_id$' }
                    }
                  ]
        , where: {
            $custom: [
              
            ]
          }
        })*/;

      db.query( query, function( error, result ){
        if ( error ) return callback( error );
        callback( null, parseRes( result ) );
      });
    }
  });