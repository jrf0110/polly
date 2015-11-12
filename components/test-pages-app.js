import React from 'react';
import PageHome from './pages/home';
import PagePoll from './pages/poll';

export default React.createClass({
  render: function(){
    return (
      <div id="app">
        <span>
          <PageHome />
          <PagePoll />
        </span>
      </div>
    );
  }
});