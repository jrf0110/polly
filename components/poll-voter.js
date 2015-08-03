import React from 'react';
import config from 'config';
import PollActions from '../actions/poll';
import CheckBox from './checkbox';
import dispatcher from '../lib/dispatcher';

export default React.createClass({
  render: function(){
    var choices = this.props.poll.choices.map( this.renderPollChoice );

    return (
      <div className="poll-voter">
        <div className="container">
          <p>Select {this.props.poll.options.numberOfVotesPerPoll}</p>
          <div className="poll-choices">
            {choices}
          </div>
        </div>
      </div>
    );
  }

, renderPollChoice: function( choice ){
    var isChecked = this.props.poll.session_responses.some( function( id ){
      return id === choice.id;
    });

    var classes = ['poll-choice'];

    if ( !isChecked && this.doneVoting() ){
      classes.push('disabled');
    }

    return (
      <div className={classes.join(' ')} key={choice.id} onClick={this.onResponseChange.bind( null, choice.id )}>
        <div className="poll-choice-col input-wrapper">
          <CheckBox
            checked={isChecked}
            onChange={this.onResponseChange.bind( null, choice.id )} />
        </div>
        <div className="poll-choice-col title-wrapper">{choice.title}</div>
      </div>
    );
  }

, doneVoting: function(){
    return this.props.poll.session_responses.length >= this.props.poll.options.numberOfVotesPerPoll;
  }

, onResponseChange: function( id ){
    if ( this.props.poll.hasSessionResponse( id ) ){
      return dispatcher.dispatch({
        type: 'REMOVE_RESPONSE'
      , id:   id
      });
    }

    if ( this.doneVoting() ){
      return;
    }

    return dispatcher.dispatch({
      type: 'ADD_RESPONSE'
    , id:   id
    });
  }
});