var express = require('express');
var config  = require('../config');
var m       = require('./middleware');

module.exports = function( options ){
  var app = express();

  app.use( require('body-parser').json() );
  app.use( require('body-parser').urlencoded({ extended: true }) );
  app.use( m.logger({ logger: options.logger }) );
  app.use( m.error() );
  app.use( m.db.init() );

  app.locals.config = config;

  if ( config.env === 'dev' ){
    app.use( express.static( __dirname + '../public' ) );
  }

  app.use( '/api', require('./api') );

  return app;
};
