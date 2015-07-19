import React from 'react';
import { RouteHandler } from 'react-router';
import config from 'config';
import Head from './head';

export default class App extends React.Component {
  render(){
    return (
      <div id="app">
        <RouteHandler />
      </div>
    );
  }
}