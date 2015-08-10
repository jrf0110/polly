import React from 'react';
import config from 'config';
import PollActions from '../actions/poll';
import PollStore from '../stores/poll';

export default React.createClass({
  render: function(){
    return (
      <div className="poll-header-hero">
        <div className="container">
          <h1>{this.props.poll.title}</h1>
          <div className="secondary-description">
            <div className="description-item">
              Select {this.props.poll.options.numberOfVotesPerPoll}
            </div>
          </div>
        </div>
      </div>
    );
  }
});