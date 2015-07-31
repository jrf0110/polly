import React from 'react';
import * as Router from 'react-router';
import config from 'config';
import Head from './head';
import PollStore from '../stores/poll';

export default React.createClass({
  mixins: [ Router.Navigation ]

, componentDidMount: function(){
    PollStore.on('create', function(){
      var poll = PollStore.get();
      console.log('Transitioning to', '/polls/' + poll.id );
      this.transitionTo( '/polls/' + poll.id );
    }.bind( this ));
  }

, render: function(){
    return (
      <div id="app">
        <Router.RouteHandler />
      </div>
    );
  }
})