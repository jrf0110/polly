import $ from 'jquery';
import React from 'react';
import Router from 'react-router';
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

  Router.run(routes, Router.HistoryLocation, (Handler) => {
    logger.info('Router listening');

    React.render(
      <Handler path={window.location.pathname} logger={logger} />
    , document.body
    );

    logger.info('Welcome to Polly!');
  });
});