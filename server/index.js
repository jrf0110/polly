var express         = require('express');
var React           = require('react');
var Router          = require('react-router');
var config          = require('config');
var m               = require('./middleware');
var routes          = require('./routes');

module.exports = function( options ){
  var app = express();

  app.use( require('body-parser').json() );
  app.use( require('body-parser').urlencoded({ extended: true }) );
  app.use( m.logger({ logger: options.logger }) );
  app.use( m.db.init() );

  app.locals.config = config;

  if ( config.env === 'dev' ){
    app.use( express.static( __dirname + '/../public' ) );
  }

  app.use( require('cookie-parser')() );
  app.use( require('express-dirac-session')( config.http.session ) );
  app.use( m.hydrate.init() );

  app.get('/', routes.page('home') );
  app.get('/polls/:id', routes.page('poll') );
  
  app.use( '/api', require('./api') );


  // var reactRoutes = require('./react-routes');
  // app.use( function( req, res ){
  //   Router.run( reactRoutes, req.path, function( Handler ){
  //     res.send('<!DOCTYPE html>' + React.renderToString(<Handler path={req.path} />));
  //   });
  // });

  app.use( m.error() );

  return app;
};
