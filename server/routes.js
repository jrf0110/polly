import React          from 'react';
import Router         from 'react-router';
import m              from './middleware';
import Head           from '../components/head';
import PollMiddleware from '../models/poll/middleware';
import HomePage       from '../components/pages/home';
import PollPage       from '../components/pages/poll';
import dispatcher     from '../lib/dispatcher';
import reactRoutes    from './react-routes';

var routes = module.exports = Object.create({
  head: function(){
    return function( req, res, next ){
      res.write('<!DOCTYPE html><html>')
      res.write( React.renderToString( <Head /> ) );
      res.write('<body><div id="app">');
      return next();
    };
  }

, router: function(){
    return function( req, res, next ){
      Router.run( reactRoutes, req.path, ( Handler ) => {
        res.write( React.renderToString( <Handler path={req.path} /> ) );
        return next();
      });
    }
  }

, end: function(){
    return function( req, res ){
      res.write('<script src="/dist/app.js"></script>');
      res.end('</div></body></html>');
    }
  }

, page: function( page ){
    if ( !( page in this.pages ) ){
      throw new Error( 'Cannot find page: ' + page );
    }

    return this.pages[ page ];
  }

, pages: {}
});

routes.pages.home = [
  routes.head()
, routes.router()
, routes.end()
];

routes.pages.poll = [
  routes.head()
, PollMiddleware.get()
, m.hydrate( 'poll', m.value('req.poll') )
, function( req, res, next ){
    dispatcher.dispatch({
      type: 'RECEIVE_POLL'
    , poll: req.poll
    });

    return next();
  }
, routes.router()
, routes.end()
];