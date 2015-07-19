import React from 'react';
import config from 'config';
import PollActions from '../actions/poll';
import PollStore from '../stores/poll';

function getState(){
  return {
    poll: PollStore.get()
  };
}

export default React.createClass({
  getInitialState: function(){
    console.log('getInitialState');
    return getState();
  }

, componentDidMount: function(){
    console.log('componentDidMount');
    PollStore.on( 'change', this._onChange );

    if ( this.props.params )
    if ( this.state.poll.id !== this.props.params.id ){
      PollActions.fetchPollById( this.props.params.id );
    }
  }

, componentWillUnmount: function(){
    console.log('componentDidMount');
    PollStore.removeListener( 'change', this._onChange );
  }

, render: function(){
    return (
      <div className="poll">
        <h1>{this.state.poll.title}</h1>
      </div>
    );
  }

, _onChange: function(){
    this.setState( getState() );
  }
});