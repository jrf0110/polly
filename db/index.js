var fs      = require('fs');
var path    = require('path');
var dirac   = require('dirac');
var config  = require('../config');

dirac.use( dirac.relationships() );

dirac.use( dirac.dir( __dirname + '/dals' ) );

// var modelDir = path.join( __dirname, '../models' );

// Traverse the models directory, see if there are any dals
// fs.readdirSync( modelDir )
//   .filter( function( p ){
//     return fs.statSync( path.join( modelDir, p ) ).isDirectory();
//   })
//   .filter( function( p ){
//     return fs.readdirSync( path.join( modelDir, p ) )
//       .some( function( file ){
//         return file === 'dal.js';
//       });
//   })
//   .forEach( function( p ){
//     console.log('registering', path.join( modelDir, p, 'dal' ));
//     dirac.register(
//       require( path.join( modelDir, p, 'dal' ) )
//     );
//   });

dirac.register( require('express-dirac-session/dal') );

dirac.use( require('dirac-ensure-targets')() );

dirac.init( config.db.connectionStr );

for ( var key in dirac.dals ){
  module.exports[ key ] = dirac.dals[ key ];
}

module.exports.dirac = dirac;

module.exports.query = function( query ){
  if ( typeof query === 'string' ){
    return dirac.raw.apply( dirac, arguments );
  }

  return dirac.query.apply( dirac, arguments );
};