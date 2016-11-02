'use strict';
import React from 'react';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  render: function () {
    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <h1 className='page__title'><a href='http://openaq.org' title='Visit OpenAQ.org'>
              <img src='/assets/graphics/layout/logo.svg' alt='OpenAQ logotype' height='48' />
              <span>OpenAQ</span>
            </a></h1>
            <h2 className='page__name'>Status</h2>
          </div>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
