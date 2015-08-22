import React from 'react';
import config from 'config';
import utils from '../lib/utils';
import PollActions from '../actions/poll';

export default React.createClass({
  getInitialState: function(){
    return {
      shouldShowPercents: false
    };
  }

, componentDidMount: function(){
    setTimeout( this.setState.bind( this, {
      shouldShowPercents: true
    }), 1000 );
  }

, render: function(){
    var total = this.props.poll.getTotalVotes();

    var results = this.props.poll.choices
      .map( ( choice )=>{
        var voteCount = this.props.poll.stats.responses[ choice.id ];
        var percent = voteCount === 0 ? 0 : utils.round( (voteCount / total) * 100, 1 );

        return { id: choice.id, title: choice.title, voteCount, total, percent };
      });

    return (
      <div className="container">
        <ul className="poll-results-list">
          {results.map( this.renderPollResults )}
        </ul>
      </div>
    );
  }

, renderPollResults: function( result ){
    var styles = {
      width: (this.state.shouldShowPercents ? result.percent : 0 ) + '%'
    };

    return (
      <li className="poll-result" key={result.id}>
        <div className="poll-result-col result-percent-col">
          <div className="result-percent-background">
              <div className="result-percent-text">{result.percent}%</div>
            </div>
            <div
              className="result-percent-foreground"
              style={styles}>
              <div className="result-percent-text">{result.percent}%</div>
            </div>
        </div>
        <div className="poll-result-col result-title-col">
          {result.title}
        </div>
      </li>
    );
  }
});