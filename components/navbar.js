import React from 'react';
import * as Router from 'react-router';
import config from 'config';

export default React.createClass({
  mixins: [ Router.Navigation ]

, render: function(){
    return (
      <div className="navbar">
        <div className="container">
          <a href="/" className="text-logo" onClick={this.onHomeClick}>Polly</a>
          <ul className="nav">
            <li>
              <a href="/" className="home-anchor" onClick={this.onHomeClick}>Create your own poll</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

, onHomeClick: function( e ){
    e.preventDefault();
    this.transitionTo('/');
  }
});