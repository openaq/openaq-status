'use strict';
import React from 'react';

var StatusFetch = React.createClass({
  displayName: 'StatusFetch',

  render: function () {
    return (
      <section className='fold' id='status__fetch'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Fetch health</h1>
            <div className='fold__introduction prose prose--responsive'>
              <p>Intro</p>
            </div>
          </header>
          <div className='fold__body'>
            status overview of last x fetches
          </div>
        </div>
      </section>
    );
  }
});

module.exports = StatusFetch;
