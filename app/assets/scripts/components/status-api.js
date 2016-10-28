'use strict';
import React from 'react';

import config from '../config';

// map New Relic statuses to the OpenAQ alert classes (_alerts.scss)
const statusMap = {
  'green': {
    'classes': 'alert alert--success',
    'message': 'API is up and running'
  },
  'orange': {
    'classes': 'alert alert--warning',
    'message': 'Something\'s not right'
  },
  'red': {
    'classes': 'alert alert--danger',
    'message': 'The API is down'
  }
};

var StatusApi = React.createClass({
  displayName: 'StatusApi',

  getInitialState: function () {
    return {
      'classes': 'alert alert--info',
      'message': 'API health unknown'
    };
  },

  componentDidMount: function () {
    fetch(`${config.apiBase}/status`)
      .then(response => {
        return response.json();
      })
      .catch(err => {
        console.log(err);
      })
      .then(json => {
        let s = json.results ? json.results.health_status : undefined;
        if (s && statusMap[s]) {
          this.setState(statusMap[s]);
        }
      });
  },

  render: function () {
    return (
      <section className='fold' id='status__api'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>API health</h1>
          </header>
          <div className='fold__body'>
            <p className={ this.state.classes }>
              { this.state.message }
            </p>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = StatusApi;
