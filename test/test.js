require('bable/register');

process.env.NODE_ENV = 'test';

var fs      = require('fs');
var db      = require('../db');
var utils   = require('../lib/utils');
var config  = require('../config');
var gulp    = require('../gulpfile');
var server  = require('../server')({
                logger: require('../lib/logger').create('Test')
              });

before(function( done ){
  utils.async.series(
    [ gulp.start.bind( gulp, 'destroy-database' )
    , gulp.start.bind( gulp, 'setup-db' )
    , server.listen.bind( server, config.http.port )
    ]
  , done
  );
});

require('./unit/config');
require('./unit/server');