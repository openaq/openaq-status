'use strict';
import React from 'react';

import config from '../config';

var StatusApi = React.createClass({
  displayName: 'StatusApi',

  getInitialState: function () {
    return {
      health: null
    }
  },

  componentDidMount: function () {
    fetch(`${config.api}status`)
      .then(response => {
        return response.json();
      })
      .catch(err => {
        console.log(err)
      })
      .then(json => {
        this.setState({
          health: json.results.health_status
        })
      })
  },

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
            { this.state.health ?
              <p className={ this.state.health }>
                { this.state.health }
              </p> :
              <p className='unknown'>
                API health unknown
              </p>
            }
          </div>
        </div>
      </section>
    );
  }
});

module.exports = StatusApi;
