import $ from 'jquery';
import React from 'react';
import Router from 'react-router';
import routes from '../server/react-routes';
import App from '../components/app';
import logger from './lib/logger';
import config from 'config';
import dispatcher from '../lib/dispatcher';
import Hydrator from './lib/hydrator';
import pollStore from '../stores/poll';
import PollActions from '../actions/poll';

pollStore.setLogger( logger );

window.dispatcher = dispatcher;
window.stores = {
  poll: pollStore
};

logger.info('Bootstrapping');

Hydrator().hydrate();

$(function(){
  logger.info('Domready');

  Router.run(routes, Router.HistoryLocation, (Handler) => {
    logger.info('Router listening');

    React.render(
      <Handler path={window.location.pathname} logger={logger} />
    , document.body
    );

    logger.info('Welcome to Polly!');
  });
});