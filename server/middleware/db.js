/**
 * Attach db result object/objects to res.locals
 * Pretty simple right now. The queries are static
 * ( as in you can really respond to url parameters )
 * So, whatever data you're putting on there is purely
 * auxiliary and doesn't really rely on external state
 *
 * Usage:
 *
 *   // res.locals.orders = [...];
 *   app.get('/users'
 *     m.db.orders.find( {}, { limit: 'all' } )
 *   , m.view('users', db.users, { operation: 'find' } )
 *   );
 *
 * If you're doing a findOne/insert, is uses the singular form:
 *
 *   // res.locals.someThing = { ... }
 *   app.get('/users'
 *     m.db.someThings.findOne( 1 )
 *   , m.view('users', db.users, { operation: 'find' } )
 *   );
 */

var dirac = require('dirac');
var pluralize = require('pluralize');
var deepExtend = require('deep-extend');
var db = require('../../db');
var utils = require('../../lib/utils');
var mvalue = require('./value');

var supportedMethods = [
  'find', 'findOne', 'insert', 'update', 'remove'
];

var getMiddlewareFn = function( table, method ){
  // TODO: check insert data to see if it's an array to determine if
  // the results really be singular
  var isSingular = ['findOne', 'insert'].indexOf( method ) > - 1;

  return function(){
    var originalArgs = arguments;

    return function( req, res, next ){
      var args = [];
      var arity = method === 'update' ? 3 : 2;

      if ( ['find', 'findOne'].indexOf( method ) > -1 ){
        args.push( req.dbQuery.where );
      } else if ( method === 'insert' ){
        args.push( req.dbQuery.values );
      } else if ( method === 'update' ){
        args.push( req.dbQuery.where );
        args.push( req.dbQuery.updates );
      }

      args.push( req.dbQuery );

      mvalue.resolve( req.dbQuery, req, res );

      db[ table ][ method ].apply( db[ table ], args.concat( function( error, results ){
        if ( error ) return next( error );

        res.locals[ isSingular ? pluralize.singular( table ) : table ] = results;

        next();
      }));
    };
  };
};

Object.keys( db ).filter( function( k ){
  return db[ k ] instanceof dirac.DAL;
}).forEach( function( table ){
  module.exports[ table ] = {};

  supportedMethods.forEach( function( method ){
    module.exports[ table ][ method ] = getMiddlewareFn( table, method );
  });
});

module.exports.init = function( options ){
  return function( req, res, next ){
    req.dbQuery = {
      where: {}
    };

    return next();
  };
};

module.exports.query = function( queryComponent ){
  return function( req, res, next ){
    deepExtend( req.dbQuery, queryComponent );
    return next();
  };
};