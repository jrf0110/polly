/**
 * Configures custom pg type parsers. Returns hash of data types and their
 * parsing functions.
 *
 * If you wanted you could convert all timestamps into moment
 * objects. But that might not be a good idea.
 *
 * OIDs can be found by
 * select oid, typname from pg_type where typtype = 'b' order by oid;
 */

var pg      = require('pg');
var dirac   = require('dirac');
var hstore  = require('pg-hstore')();

// Ensure all instances of pg have custom type parsers registered
var typeSets = [ pg.types, dirac.db.pg.types ];

var parsers = module.exports = [
  // hstore
  { oid: 484949
  , fn: function( val ){
      return hstore.parse( val );
    }
  }
];

var setTypeParser = function( parser ){
  typeSets.forEach( function( types ){
    types.setTypeParser( parser.oid, parser.fn );
  });
};

parsers.forEach( setTypeParser );
