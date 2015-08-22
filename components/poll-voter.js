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
          <div className="poll-choices">
            {choices}
          </div>
        </div>
        <div className="poll-voter-footer">
          <div className="container">
            <div className="actions">
              <button
                disabled={this.props.poll.isSaving() || this.props.poll.pending_session_responses.length === 0}
                className="vote-btn"
                onClick={this.onVoteBtnClick}>Vote</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

, renderPollChoice: function( choice ){
    var isChecked = this.props.poll.pending_session_responses.some( function( id ){
      return id === choice.id;
    });

    var classes = ['poll-choice'];

    if ( !isChecked && this.props.poll.hasMetMaximumNumberOfVotes() ){
      classes.push('disabled');
    }

    return (
      <div className={classes.join(' ')} key={choice.id} onClick={this.onResponseClick.bind( null, choice.id )}>
        <div className="poll-choice-col input-wrapper">
          <CheckBox
            checked={isChecked}
            onChange={this.onResponseChange.bind( null, choice.id )} />
        </div>
        <div className="poll-choice-col title-wrapper">{choice.title}</div>
      </div>
    );
  }

, onResponseClick: function( id, e ){
    if ( e.target.classList.contains('checkbox-facade') ) return;
    this.onResponseChange( id );
  }

, onResponseChange: function( id ){
    if ( this.props.poll.hasSessionResponse( id ) ){
      return dispatcher.dispatch({
        type: 'REMOVE_RESPONSE'
      , id:   id
      });
    }

    if ( this.props.poll.hasMetMaximumNumberOfVotes() ){
      return;
    }

    if ( this.props.poll.doneVoting() ){
      return;
    }

    return dispatcher.dispatch({
      type: 'ADD_RESPONSE'
    , id:   id
    });
  }

, onVoteBtnClick: function( e ){
    if ( this.props.poll.isSaving() ){
      return;
    }

    return dispatcher.dispatch({
      type: 'SAVE_RESPONSES'
    });
  }
});