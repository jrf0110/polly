import React from 'react';
import PollStore from '../../stores/poll';
import PollEditor from '../poll-editor';
import dispatcher from '../../lib/dispatcher';

export default React.createClass({
  componentDidMount: function(){
    PollStore.on( 'change', this.onPollChange );

    dispatcher.dispatch({
      type: 'RESET_POLL'
    });
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
        <PollEditor defaultNumChoices="3" poll={this.state.poll} logger={this.props.logger} />
      </div>
    );
  }

, onPollChange: function(){
    this.setState({
      poll: PollStore.get()
    });
  }
});