require('lodash').extend( module.exports, require('lodash') );

module.exports.async      = require('async');
module.exports.deepExtend = require('deep-extend');
module.exports.http       = require('superagent');

module.exports.deepForIn = function( obj, iterator ){
  for ( var key in obj ){
    if ( typeof obj[ key ] === 'object' ){
      module.exports.deepForIn( obj[ key ], iterator );
    } else {
      iterator( key, obj[ key ], obj );
    }
  }
};

module.exports.flattenArrayReduce = function( list, item ){
  if ( Array.isArray( item ) ){
    return list.concat( item );
  }

  list.push( item );

  return list;
};

module.exports.noop = function(){};