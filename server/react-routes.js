import React from 'react';
import { Route, IndexRoute, Router } from 'react-router';
import App from '../components/app';
import TestPagesApp from '../components/test-pages-app';
import HomePage from '../components/pages/home';
import PollPage from '../components/pages/poll';

export default (
  <Router>
    <Route name="top" component={App} path="/">
      <IndexRoute component={HomePage} />
      <Route name="poll" component={PollPage} path="/polls/:id" />
    </Route>
    <Route name="test-pages" component={TestPagesApp} path="/test-pages" />
  </Router>
);