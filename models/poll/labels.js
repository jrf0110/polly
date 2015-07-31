var decamelize = require('decamelize');

module.exports = require('stampit')()
  .methods({
    _labels: {
      'options.numberOfVotesPerPoll': 'Allowed number of votes'
    , 'options.multipleSessionsPerIp': 'Block multiple sessions from the same IP?'
    }

  , label: function( key ){
      if ( !(key in this._labels) ){
        return decamelize( key, ' ')
          .split(' ')
          .map( word=> word[0].toUpperCase() + word.substring(1) )
          .join(' ');
      }

      return this._labels[ key ];
    }
  });