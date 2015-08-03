import React from 'react';
import config from 'config';
import PollStore from '../../stores/poll';
import PollEditor from '../poll-editor';
import Poll from '../../models/poll/db';
import dispatcher from '../../lib/dispatcher';

export default React.createClass({
  componentDidMount: function(){
    dispatcher.dispatch({
      type: 'CLEAR_POLL_ID'
    });

    PollStore.on( 'change', this.onPollChange );
  }

, componentWillUnmount: function(){
    PollStore.removeListener( 'change', this.onPollChange );
  }

, getInitialState: function(){
    return {
      poll: PollStore.get()
    };
  }

, render: function(){
    return (
      <div className="page">
        <PollEditor defaultNumChoices="3" poll={this.state.poll} />
      </div>
    );
  }

, onPollChange: function(){
    this.setState({
      poll: PollStore.get()
    });
  }
});