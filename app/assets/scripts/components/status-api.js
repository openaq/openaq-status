'use strict';
import React from 'react';

var StatusApi = React.createClass({
  displayName: 'StatusApi',

  render: function () {
    return (
      <section className='fold' id='status__api'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>API health</h1>
            <div className='fold__introduction prose prose--responsive'>
              <p>Intro</p>
            </div>
          </header>
          <div className='fold__body'>
            status overview of API
          </div>
        </div>
      </section>
    );
  }
});

module.exports = StatusApi;
