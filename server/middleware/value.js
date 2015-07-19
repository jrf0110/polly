/**
 * MValue -
 *
 * Returns a function that will evaluate the path at
 * either req/res
 *
 * Usage:
 *
 * app.get('/users/:id'
 * , m.db.where({ id: m.value('req.params.id') })
 * , m.logger.info('Looking up user', m.value('req.params.id') )
 * , m.db.users.findOne()
 * , m.logger.info('Found user', m.value('req.user.id'), m.value('req.user.name') )
 * , m.json( m.value('req.user') )
 * );
 */

var dotty = require('dotty');
var utils = require('../../lib/utils');

var coercions = {
  number: function( v ){
    return +v;
  }

, string: function( v ){
    return '' + v;
  }
};

module.exports = function( str, coercion ){
  var mvalue = function( req, res ){
    var obj = { req: req, res: res };
    var value = dotty.get( obj, str );

    if ( typeof coercion === 'string' )
    if ( coercion in coercions ){
      value = coercions[ coercion ]( value );
    }

    return value;
  };

  mvalue.__isMValue = true;

  return mvalue;
};

module.exports.resolve = function( search, req, res ){
  utils.deepForIn( search, function( key, val, obj ){
    if ( val.__isMValue ){
      obj[ key ] = val( req, res );
    }
  });
};