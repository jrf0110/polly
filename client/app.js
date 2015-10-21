import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import routes from '../server/react-routes';
import logger from './lib/logger';
import dispatcher from '../lib/dispatcher';
import Hydrator from './lib/hydrator';
import pollStore from '../stores/poll';

pollStore.setLogger( logger );

window.dispatcher = dispatcher;

window.stores = {
  poll: pollStore
};

logger.info('Bootstrapping');

Hydrator({ logger }).hydrate();

$(function(){
  logger.info('Domready');

  ReactDOM.render(
    <Router history={createBrowserHistory()}>
      {routes.props.children}
    </Router>
  , document.getElementById('app-container')
  );

  logger.info('Welcome to Polly!');
});