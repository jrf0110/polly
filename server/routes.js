import React              from 'react';
import { renderToString } from 'react-dom/server';
import { match }          from 'react-router';
import { RoutingContext } from 'react-router';
import m                  from './middleware';
import Head               from '../components/head';
import PollMiddleware     from '../models/poll/middleware';
import HomePage           from '../components/pages/home';
import PollPage           from '../components/pages/poll';
import dispatcher         from '../lib/dispatcher';
import reactRoutes        from './react-routes';

var routes = module.exports = Object.create({
  head: function(){
    return function( req, res, next ){
      res.write('<!DOCTYPE html><html>');
      res.write( renderToString( <Head /> ) );
      res.write('<body><div id="app-container">');
      return next();
    };
  }

, router: function(){
    return function( req, res, next ){
      match({ routes: reactRoutes, location: req.url }, ( error, redirectLoc, props )=>{
        res.write( renderToString( <RoutingContext {...props} /> ));
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
, function( req, res, next ){
    dispatcher.dispatch({
      type: 'RECEIVE_POLL'
    , poll: req.poll
    });

    return next();
  }
, routes.router()
, m.hydrate( 'poll', m.value('req.poll') )
, routes.end()
];