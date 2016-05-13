var express         = require('express');
var config          = require('../config');
var m               = require('./middleware');
var routes          = require('./routes');

module.exports = function( options ){
  var app = express();

  app.use( require('body-parser').json() );
  app.use( require('body-parser').urlencoded({ extended: true }) );
  app.use( m.logger({ logger: options.logger }) );
  app.use( m.db.init() );

  app.locals.config = config;

  app.use( express.static( __dirname + '/../public' ) );

  app.use( require('cookie-parser')() );
  app.use( require('express-dirac-session')( config.http.session ) );

  app.get('/', routes.page('home') );
  app.get('/polls/:id', routes.page('poll') );
  app.get('/test-pages', routes.page('testPages') );
  
  app.use( '/api', require('./api') );

  app.use( m.error() );

  return app;
};
