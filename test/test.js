// require('babel/register');

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
  console.log('!! Destroy test database !!');
  console.log('   Ensure all clients have disconnected');

  utils.async.series(
    [ gulp.start.bind( gulp, 'db:destroy' )
    , gulp.start.bind( gulp, 'db:setup' )
    , server.listen.bind( server, config.http.port )
    ]
  , done
  );
});

require('./unit/config');
require('./unit/models');
require('./unit/db');
require('./unit/server');