import React from 'react';
import config from 'config';
import Poll from '../poll';

export default class PollPage extends React.Component {
  render(){
    return (
      <div className="page">
        <Poll poll={this.props.poll} />
      </div>
    );
  }
}