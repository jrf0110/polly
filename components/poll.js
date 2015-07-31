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
    return getState();
  }

, componentDidMount: function(){
    PollStore.on( 'change', this._onChange );

    if ( this.props.params )
    if ( this.state.poll.id !== this.props.params.id ){
      PollActions.fetchPollById( this.props.params.id );
    }
  }

, componentWillUnmount: function(){
    PollStore.removeListener( 'change', this._onChange );
  }

, render: function(){
    var choices = this.state.poll.choices.map( choice => {
      return <li>{choice.title}</li>
    });

    return (
      <div className="poll">
        <h1>{this.state.poll.title}</h1>
        <ul>
          {choices}
        </ul>
      </div>
    );
  }

, _onChange: function(){
    this.setState( getState() );
  }
});