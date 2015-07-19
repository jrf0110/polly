import React from 'react';
import config from 'config';
import PollCreator from '../poll-creator';

export default class HomePage extends React.Component {
  render(){
    return (
      <div className="page">
        <PollCreator />
      </div>
    );
  }
}