import React from 'react';
import * as Router from 'react-router';
import config from 'config';
import PollActions from '../actions/poll';
import PollStore from '../stores/poll';

export default React.createClass({
  mixins: [ Router.Navigation ]

, render: function(){
    var secondaryDescription = (
      <div className="secondary-description">
        <div className="description-item">
          Select {this.props.poll.options.numberOfVotesPerPoll}
        </div>
      </div>
    );

    return (
      <div className="poll-header-hero">
        <div className="container title-wrapper">
          <h1>{this.props.poll.title}</h1>
          { !this.props.polll.doneVoting() ? secondaryDescription : null }
        </div>
      </div>
    );
  }

, onHomeClick: function( e ){
    e.preventDefault();
    this.transitionTo('/');
  }
});