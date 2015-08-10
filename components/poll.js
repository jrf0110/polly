import React from 'react';
import config from 'config';
import PollActions from '../actions/poll';
import PollHeader from './poll-header';
import PollVoter from './poll-voter';
import PollResults from './poll-results';

export default React.createClass({
  render: function(){
    return (
      <div className="poll">
        <PollHeader poll={this.props.poll} />
        {({ true:   <PollResults poll={this.props.poll} />
          , false:  <PollVoter poll={this.props.poll} />
        })[ this.props.poll.doneVoting() ]}
      </div>
    );
  }
});