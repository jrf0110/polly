import React from 'react';
import config from 'config';
import PollEditor from '../poll-editor';
import Poll from '../../models/poll/db';
import dispatcher from '../../lib/dispatcher';

export default React.createClass({
  componentDidMount: function(){
    dispatcher.dispatch({
      type: 'CLEAR_POLL_ID'
    });
  }

, render: function(){
    return (
      <div className="page">
        <PollEditor defaultNumChoices="3" />
      </div>
    );
  }
});