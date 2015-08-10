/**
 * hasVoted helper
 * Pass in `hasVoted: { user_ip, session_id }`
 */

module.exports = function( options ){
  return function( dirac ){
    function beforeFind( query, schema, next ){
      if ( !query.hasVoted ){
        return next();
      }

      query.columns = query.columns || ['*'];

      var hasVotedQuery = [
        '(case'
      , '  when (polls.options->>\'multipleSessionsPerIp\')::boolean is true then'
      , '    session_id = $1'
      , '  else'
      , '    user_ip = $2'
      , 'end)'
      ].join('\n');

      // query.columns.push({
      //   type: 'expression'
      // , alias: 'has_voted'
      // , expression: {
      //     parenthesis: true
      //   , expression: [
      //       'case'
      //     , '  when (polls.options->>\'multipleSessionsPerIp\')::boolean is true then'
      //     , '    exists(select * from poll_responses where poll_id = polls.id and session_id = $1)'
      //     , '  else'
      //     , '    exists(select * from poll_responses where poll_id = polls.id and user_ip = $2)'
      //     , 'end'
      //     ].join('\n')
      //   , values: [ query.hasVoted.session_id, query.hasVoted.user_ip ]
      //   }
      // });

      query.pluck = query.pluck || [];

      query.pluck.push({
        table: 'poll_responses'
      , alias: 'session_responses'
      , column: 'poll_choice_id'
      , where: {
          $custom: [ hasVotedQuery, query.hasVoted.session_id, query.hasVoted.user_ip ]
        }
      });

      return next();
    }

    dirac.dals.polls.before( 'find', beforeFind );
    dirac.dals.polls.before( 'findOne', beforeFind );
  };
};