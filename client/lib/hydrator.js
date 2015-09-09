var utils = require('../../lib/utils');
var dispatcher = require('../../lib/dispatcher');

module.exports = function( options ){
  options = utils.defaults( options || {}, {
    path: '__data'

  , hydrators: {
      poll: function( poll ){
        dispatcher.dispatch({
          type: 'RECEIVE_POLL'
        , poll: poll
        });
      }
    }

  , logger: require('./logger')
  });

  var logger = options.logger.create('Hydrator');

  return Object.create({
    options: options

  , hydrate: function(){
      var data = window[ options.path ];
      logger.debug('Hydrating', data);

      for ( var key in data ){
        if ( !(key in options.hydrators ) ) continue;

        logger.debug( 'Hydrating', key, 'with', data[ key ] );
        options.hydrators[ key ]( data[ key ] );
      }
    }
  });
};