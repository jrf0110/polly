var fs      = require('fs');
var path    = require('path');
var dirac   = require('dirac');
var config  = require('../config');

require('./type-parsers');

dirac.use( dirac.relationships() );
dirac.use( dirac.dir( __dirname + '/dals' ) );
dirac.use( require('../lib/dirac-types')( require('./type-serializers') ) );
// dirac.use( require('../models/poll-stat/parse-hstores')() );

dirac.register( require('express-dirac-session/dal') );

dirac.use( require('dirac-ensure-targets')() );
dirac.use( require('../models/poll/dirac-has-voted')() );

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