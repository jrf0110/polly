import React from 'react';
import * as Router from 'react-router';
import PollStore from '../stores/poll';

export default React.createClass({
  mixins: [ Router.Navigation ]

, componentDidMount: function(){
    PollStore.on('create', function(){
      this.transitionTo( '/polls/' + PollStore.get().id );
    }.bind( this ));
  }

, render: function(){
    return (
      <div id="app">
        <Router.RouteHandler logger={this.props.logger} />
      </div>
    );
  }
})