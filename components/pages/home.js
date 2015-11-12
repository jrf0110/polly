import React from 'react';
import PollStore from '../../stores/poll';
import PollEditor from '../poll-editor';
import dispatcher from '../../lib/dispatcher';

export default React.createClass({
  getDefaultProps: function(){
    return {
      key: 'home'
    };
  }

, componentDidMount: function(){
    PollStore.on( 'change', this.onPollChange );

    dispatcher.dispatch({
      type: 'RESET_POLL'
    });

    console.log('page', this.props.key);
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
      <div className="page page-home">
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