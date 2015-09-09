import React from 'react';
import Poll from '../poll';
import PollActions from '../../actions/poll';
import PollStore from '../../stores/poll';
import Navbar from '../navbar';

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
        <Navbar poll={this.state.poll} logger={this.props.logger} />
        <Poll poll={this.state.poll} logger={this.props.logger} />
      </div>
    );
  }

, _onChange: function(){
    this.setState( getState() );
  }
});