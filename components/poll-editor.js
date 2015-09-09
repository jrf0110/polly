import React from 'react';
import utils from '../lib/utils';
import PollChoice from '../models/poll-choice';
import PollStore from '../stores/poll';
import dispatcher from '../lib/dispatcher';
import CheckboxWrapper from './checkbox';

export default React.createClass({
  getInitialState: function(){
    return {
      poll: PollStore.get()
    };
  }

, getChoicesJSX: function(){
    return utils.range( Math.max(
        this.props.poll.choices.length + 1, this.props.defaultNumChoices
      ))
      .map( i => this.props.poll.choices[ i ] || PollChoice.create() )
      .map( ( choice, i )=> {
        var placeholder = 'Choice #' + ( i + 1 );
        return (
          <div className="poll-choice poll-form-group" key={i}>
            <input
              type="text"
              className="poll-choice-input"
              placeholder={placeholder}
              data-index={i}
              onChange={this.onChoiceChange}
              value={choice.title} />
          </div>
        );
      });
  }

, render: function(){
    var choices = this.getChoicesJSX();

    var errors = this.props.poll.validate();
    var disableSubmit = errors && errors.length;

    return (
      <form className="poll-editor" onSubmit={this.onSubmit}>
        <div className="container main-inputs">
          <div className="poll-form-group">
            <input
              type="text"
              className="poll-title"
              placeholder="Submit a poll"
              onChange={this.onTitleChange}
              value={this.props.poll.title} />
          </div>
          <div className="poll-choices">
            {choices}
          </div>
        </div>
        <div className="poll-editor-footer theme-neon-purple">
          <div className="container">
            <div className="options-editor">
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="number"
                    value={this.props.poll.options.numberOfVotesPerPoll}
                    onChange={this.onNumberOfVotesPerPollChange}
                    min="1"
                  />
                </div>
                <label>{this.props.poll.label('options.numberOfVotesPerPoll')}</label>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <CheckboxWrapper
                    checked={!this.props.poll.options.multipleSessionsPerIp}
                    onChange={this.onMultipleSessionsPerIpChange}
                  />
                </div>
                <label>{this.props.poll.label('options.multipleSessionsPerIp')}</label>
              </div>
            </div>
            <div className="action-wrapper">
              <button
                disabled={disableSubmit}
                type="submit">{this.state.id ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      </form>
    );
  }

, onSubmit: function( e ){
    e.preventDefault();

    dispatcher.dispatch({
      type: 'SAVE_POLL'
    });
  }

, onTitleChange: function( e ){
    dispatcher.dispatch({
      type: 'UPDATE_POLL'
    , data: { title: e.target.value }
    });
  }
  

, onChoiceChange: function( e ){
    var i = +e.target.getAttribute('data-index');

    if ( isNaN(i) ){
      return this.props.logger.warn('Choice changed, but we were unable to get the index');
    }

    dispatcher.dispatch({
      type: 'UPDATE_CHOICE'
    , index: i
    , value: e.target.value
    });
  }

, onNumberOfVotesPerPollChange: function( e ){
    dispatcher.dispatch({
      type:   'UPDATE_POLL_OPTIONS'
    , option: 'numberOfVotesPerPoll'
    , value:  Math.max( +e.target.value, 1 )
    });
  }

, onMultipleSessionsPerIpChange: function( val ){
    dispatcher.dispatch({
      type:   'UPDATE_POLL_OPTIONS'
    , option: 'multipleSessionsPerIp'
    , value:  !val
    });
  }
});