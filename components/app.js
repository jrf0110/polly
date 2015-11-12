import React from 'react';
import * as Router from 'react-router';
import PollStore from '../stores/poll';
import CSSTransitionGroup from 'react-addons-css-transition-group';

export default React.createClass({
  mixins: [ Router.History ]

, componentDidMount: function(){
    PollStore.on( 'create', this.onPollCreate );
  }

, componentWillUnmount: function(){
    PollStore.removeListener( 'create', this.onPollCreate );
  }

, render: function(){
    return (
      <div id="app">
        <CSSTransitionGroup
          transitionName="page"
          transitionEnterTimeout={800}
          transitionLeaveTimeout={800}>
            {React.cloneElement(this.props.children || <div />, { key: this.props.location.pathname })}
        </CSSTransitionGroup>
      </div>
    );
  }

, onPollCreate: function(){
    this.history.pushState( null, '/polls/' + PollStore.get().id );
  }
});