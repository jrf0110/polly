import React from 'react';
import { Route, DefaultRoute } from 'react-router';
import App from '../components/app';
import HomePage from '../components/pages/home';
import PollPage from '../components/pages/poll';

export default (
  <Route name="top" handler={App} path="/">
    <DefaultRoute handler={HomePage} />
    <Route name="poll" handler={PollPage} path="/polls/:id" />
  </Route>
);