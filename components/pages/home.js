import React from 'react';
import config from 'config';
import PollCreator from '../poll-creator';
import Poll from '../../models/poll/db';

export default React.createClass({
  render: function(){
    return (
      <div className="page">
        <PollCreator defaultNumChoices="3" />
      </div>
    );
  }
});