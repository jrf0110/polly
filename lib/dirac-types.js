/**
 * Serialize data before writing
 */

var _ = require('lodash');

module.exports = function( options ){
  options = _.defaults( options || {}, {
    writeOps: ['insert', 'update']
  , types: {}
  });

  var types = options.types;

  return function( dirac ){
    var columnHasListener = function( schema, column ){
      return schema[ column ].type in types;
    };

    var serializeData = function( query, schema, next ){
      var vals;

      if ( query.type === 'insert' ){
        vals = Array.isArray( query.values ) ? query.values : [ query.values ];
      } else if ( query.type === 'update' ){
        vals = [ query.updates ];
      }

      vals.forEach( function( obj ){
        Object
          .keys( obj )
          .filter( function( col ){
            return schema[ col ].type in types;
          })
          .forEach( function( col ){
            obj[ col ] = types( schema[ col ].type, obj[ col ] );
          });
      });

      next();
    };

    // Register middleware
    Object
      .keys( dirac.dals )
      // Filter down to tables that have listeners
      .filter( function( table ){
        return Object
          .keys( dirac.dals[ table ].schema )
          .some( columnHasListener.bind( null, dirac.dals[ table ].schema ) );
      })
      // Apply serialization/parsing logic to applicable dals
      .forEach( function( table ){
        options.writeOps.forEach( function( op ){
          dirac.dals[ table ].before( op, serializeData );
        });
      });
  };
};