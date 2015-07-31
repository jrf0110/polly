import React from 'react';
import config from 'config';
import utils from '../lib/utils';
import Poll from '../models/poll';
import PollChoice from '../models/poll-choice';
import PollStore from '../stores/poll';
import dispatcher from '../lib/dispatcher';

export default React.createClass({
  getInitialState: function(){
    return {
      poll: PollStore.get()
    };
  }

, getDefaultProps: function(){
    return {
      defaultNumChoices: 3
    }
  }

, componentDidMount: function(){
    PollStore.on( 'change', this.onPollChange );
  }

, componentWillUnmount: function(){
    PollStore.removeListener( 'change', this.onPollChange );
  }

, render: function(){
    var numFilled = this.state.poll.choices
      .filter( function( choice ){
        return choice && choice.title;
      })
      .length;

    var choices = utils.range( Math.max(
      this.state.poll.choices.length + 1, this.props.defaultNumChoices
    ));

    choices = choices
      .map( i => this.state.poll.choices[ i ] || PollChoice.create() )
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

    var errors = this.state.poll.validate();
    var disableSubmit = errors && errors.length;

    return (
      <form className="poll-editor" onSubmit={this.onSubmit}>
        <div className="container main-inputs">
          <div className="poll-form-group">
            <input
              type="text"
              className="poll-title"
              placeholder="Enter a title"
              onChange={this.onTitleChange}
              value={this.state.poll.title} />
          </div>
          <div className="poll-choices">
            {choices}
          </div>
        </div>
        <div className="poll-editor-footer theme-neon-purple">
          <div className="container">
            <div className="options-editor">
              <div className="form-group">
                <input
                  type="number"
                  value={this.state.poll.options.numberOfVotesPerPoll}
                  onChange={this.onNumberOfVotesPerPollChange}
                  min="1"
                />
                <label>{this.state.poll.label('options.numberOfVotesPerPoll')}</label>
              </div>
              <div className="form-group">
                <input
                  type="checkbox"
                  checked={!this.state.poll.options.multipleSessionsPerIp}
                  onChange={this.onMultipleSessionsPerIpChange}
                />
                <label>{this.state.poll.label('options.multipleSessionsPerIp')}</label>
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
      return console.warn('Choice changed, but we were unable to get the index');
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

, onMultipleSessionsPerIpChange: function( e ){
    dispatcher.dispatch({
      type:   'UPDATE_POLL_OPTIONS'
    , option: 'multipleSessionsPerIp'
    , value:  !e.target.checked
    });
  }

, onPollChange: function(){
    this.setState({
      poll: PollStore.get()
    });
  }
});