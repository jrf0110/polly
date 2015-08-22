import React from 'react';
import * as Router from 'react-router';
import config from 'config';
import PollActions from '../actions/poll';
import PollStore from '../stores/poll';

export default React.createClass({
  mixins: [ Router.Navigation ]

, render: function(){
    return (
      <div className="poll-header-hero">
        <div className="container">
          <h1>{this.props.poll.title}</h1>
          <div className="secondary-description">
            <div className="description-item">
              Select {this.props.poll.options.numberOfVotesPerPoll}
            </div>
          </div>
          { this.props.poll.doneVoting()
              ? <a href="/" className="home-anchor" onClick={this.onHomeClick}>Create your own poll</a>
              : null
          }
        </div>
      </div>
    );
  }

, onHomeClick: function( e ){
    e.preventDefault();
    this.transitionTo('/');
  }
});