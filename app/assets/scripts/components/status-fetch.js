'use strict';
import React from 'react';
import moment from 'moment';
import flatten from 'lodash.flatten';

import config from '../config';

const statusMap = {
  'success': {
    'message': 'Fetch seems to be working properly.',
    'classes': 'alert alert--success'
  },
  'apiDown': {
    'message': 'The API is down, can\'t determine the status of OpenAQ fetch',
    'classes': 'alert alert--info'
  },
  'timeAgo': {
    'message': 'The last fetch started more than 12 minutes ago.',
    'classes': 'alert alert--warning',
    warning (state) { return state.lastFinish > 720; }
  },
  'noResults': {
    'message': 'At least one of the last five fetches yielded no result.',
    'classes': 'alert alert--warning',
    warning (state) { return state.fetches.some(f => f.measurements === 0); }
  }
};

var StatusFetch = React.createClass({
  displayName: 'StatusFetch',

  getInitialState: function () {
    return {
      'count': null,
      'status': [],
      'fetches': []
    };
  },

  componentDidMount: function () {
    fetch(`${config.apiBase}${config.apiVersion}/fetches?k=${new Date().getTime()}`)
      .then(response => {
        return response.json();
      })
      .catch(err => {
        console.log(err);
      })
      .then(json => {
        let lastResults = json.results.slice(0, 5);
        this.setState({
          'count': lastResults.map(f => f.count).reduce((a, b) => a + b),
          'lastFinish': moment(Date.now()).diff(moment(lastResults[0].timeStarted), 'seconds'),
          'fetches': lastResults.map(f => {
            return {
              'duration': moment(f.timeEnded).diff(moment(f.timeStarted), 'seconds'),
              'failures': flatten(f.results.map(s => {
                let fails = [];
                for (let fail in s.failures) {
                  fails.push(`${s.sourceName} - ${fail} (${s.failures[fail]} failed)`);
                }
                return fails;
              })),
              'measurements': f.count,
              'sources': f.results.length,
              'timeAgo': moment(f.timeEnded).fromNow()
            };
          })
        });
      }).catch(err => {
        this.setState({
          'status': ['apiDown']
        });
        console.log(err);
      }).then(json => {
        // if no status has been set thus far, check for warnings
        if (this.state.status.length === 0) {
          this.getStatus();
        }
      });
  },

  getStatus: function () {
    let statuses = [];

    // check for warnings
    for (let s in statusMap) {
      if (statusMap[s].warning && typeof statusMap[s].warning === 'function') {
        if (statusMap[s].warning(this.state)) {
          statuses.push(s);
        }
      }
    }

    // no warning detected? it must be a success
    if (statuses.length === 0) { statuses.push('success'); }

    this.setState({
      'status': statuses
    });
  },

  renderStatus: function () {
    return (
      <ul className='alert-group'>
        {this.state.status.map((s, i) => {
          return <li className={statusMap[s].classes} key={i}>{statusMap[s].message}</li>;
        })}
      </ul>
    );
  },

  renderFetchSummary: function () {
    return (
      <div className='fold__body'>
        {this.state.fetches.map((f, i) => {
          return (
            <article className='card' key={i}>
              <div className='card__contents'>
                <header className='card__header'>
                  <p className='card__subtitle'>Fetch finished <strong>{ f.timeAgo }</strong></p>
                </header>
                <div className='card__body'>
                  <dl>
                    <dt>New measurements</dt>
                    <dd>{ f.measurements }</dd>
                    <dt>Sources reporting</dt>
                    <dd>{ f.sources }</dd>
                    <dt>Total duration</dt>
                    <dd>{ f.duration } seconds</dd>
                    <dt>Failures</dt>
                    { f.failures.map((fail, i) => <dd key={i}>{fail}</dd>) }
                  </dl>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  },

  render: function () {
    return (
      <section className='fold' id='status__fetch'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Fetch health</h1>
          </header>

          {this.renderStatus()}
          {this.renderFetchSummary()}

        </div>
      </section>
    );
  }
});

module.exports = StatusFetch;
