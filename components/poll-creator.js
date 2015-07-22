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
      numFilled + 1, this.props.defaultNumChoices
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

    return (
      <form className="poll-creator">
        <div className="container main-inputs">
          <div className="poll-form-group">
            <input
              type="text"
              className="poll-title"
              placeholder="Enter a title"
              value={this.state.poll.title} />
          </div>
          <div className="poll-choices">
            {choices}
          </div>
        </div>
        <div className="poll-creator-footer">
          Footer
        </div>
      </form>
    );
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

, onPollChange: function(){
    this.setState({
      poll: PollStore.get()
    });
  }
});