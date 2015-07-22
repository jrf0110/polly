import $ from 'jquery';
import React from 'react';
import Router from 'react-router';
import routes from '../server/react-routes';
import App from '../components/app';
import logger from './lib/logger';
import config from 'config';
import dispatcher from '../lib/dispatcher';
import Hydrator from './lib/hydrator';

require('../stores/poll').setLogger( logger );

window.dispatcher = dispatcher;

logger.info('Bootstrapping');

Hydrator().hydrate();

$(function(){
  logger.info('Domready');

  Router.run(routes, Router.HistoryLocation, (Handler) => {
    logger.info('Router listening');

    React.render(
      <Handler path={window.location.pathname} />
    , document.getElementById('app')
    );

    logger.info('Welcome to Polly!');
  });
});