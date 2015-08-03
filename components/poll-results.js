import React from 'react';
import config from 'config';
import PollActions from '../actions/poll';

export default React.createClass({
  render: function(){
    var choices = this.props.poll.choices.map( choice => {
      return <li>{choice.title}</li>
    });

    return (
      <div className="poll-results">
        Results
        <ul>
          {choices}
        </ul>
      </div>
    );
  }
});