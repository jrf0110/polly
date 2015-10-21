import React from 'react';
import * as Router from 'react-router';

var Link = Router.Link;

export default React.createClass({
  mixins: [ Router.Navigation ]

, render: function(){
    return (
      <div className="navbar">
        <div className="container">
          <Link to="/" className="text-logo">Polly</Link>
          <ul className="nav">
            <li>
              <Link to="/" className="home-anchor">Create your own poll</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});