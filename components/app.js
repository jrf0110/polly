import React from 'react';
import * as Router from 'react-router';
import PollStore from '../stores/poll';
import CSSTransitionGroup from 'react-addons-css-transition-group';

export default React.createClass({
  mixins: [ Router.History ]

, componentDidMount: function(){
    PollStore.on( 'create', () => {
      this.history.pushState( null, '/polls/' + PollStore.get().id );
    });
  }

, render: function(){
    return (
      <CSSTransitionGroup
        transitionName="test"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        <div id="app">
          {this.props.children}
        </div>
      </CSSTransitionGroup>
    );
  }
});