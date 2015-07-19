import React from 'react';
import { RouteHandler } from 'react-router';
import config from 'config';

export default class App extends React.Component {
  render(){
    return (
      <head>
        <link rel="stylesheet" href="/dist/app.css" />
      </head>
    );
  }
}