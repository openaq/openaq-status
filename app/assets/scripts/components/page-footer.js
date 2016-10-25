'use strict';
import React from 'react';

var PageFooter = React.createClass({
  displayName: 'PageFooter',

  render: function () {
    return (
      <footer className='page__footer' role='contentinfo'>
        <p className='copyright'>
          Made with <span className='heart'></span> by <a href='https://developmentseed.org' title='Visit Development Seed website'>Development Seed</a> and the <a href='https://openaq.org/' title='Visit the OpenAQ website'>OpenAQ</a> team.
        </p>
      </footer>
    );
  }
});

module.exports = PageFooter;
