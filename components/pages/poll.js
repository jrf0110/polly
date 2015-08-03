import React from 'react';
import config from 'config';
import Poll from '../poll';
import PollActions from '../../actions/poll';
import PollStore from '../../stores/poll';

function getState(){
  return {
    poll: PollStore.get()
  };
}

export default React.createClass({
  getInitialState: function(){
    return getState();
  }

, componentDidMount: function(){
    PollStore.on( 'change', this._onChange );

    if ( this.props.params )
    if ( this.state.poll.id != this.props.params.id ){
      PollActions.fetchPollById( this.props.params.id );
    }
  }

, componentWillUnmount: function(){
    PollStore.removeListener( 'change', this._onChange );
  }

, render: function(){
    return (
      <div className="page">
        <Poll poll={this.state.poll} />
      </div>
    );
  }

, _onChange: function(){
    this.setState( getState() );
  }
});