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
  },
  'unknown': {
    'classes': 'alert alert--info',
    'message': 'API health unknown'
  }
};

var StatusApi = React.createClass({
  displayName: 'StatusApi',

  getInitialState: function () {
    return {
      'status': 'unknown'
    };
  },

  componentDidMount: function () {
    fetch(`${config.apiBase}/status`)
      .then(response => {
        if (response.status > 300) {
          return 'red';
        } else if (response.json.results) {
          return response.json.results.health_status || undefined;
        }
      })
      .catch(err => {
        console.log(err);
      })
      .then(status => {
        if (status && statusMap[status]) {
          this.setState({
            'status': status
          });
        }
      });
  },

  render: function () {
    let s = statusMap[this.state.status];
    return (
      <section className='fold' id='status__api'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>API health</h1>
          </header>
          <div className='fold__body'>
            <p className={ s.classes }>
              { s.message }
            </p>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = StatusApi;
