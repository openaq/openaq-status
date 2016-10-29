'use strict';
import React from 'react';
import moment from 'moment';
import flatten from 'lodash.flatten';

import config from '../config';

var StatusFetch = React.createClass({
  displayName: 'StatusFetch',

  getInitialState: function () {
    return {
      'count': null,
      'fetches': []
    }
  },

  componentDidMount: function () {
    fetch(`${config.apiBase}${config.apiVersion}/fetches`)
      .then(response => {
        return response.json();
      })
      .catch(err => {
        console.log(err)
      })
      .then(json => {
        let lastResults = json.results.slice(0,5)
        this.setState({
          'count': lastResults.map(f => f.count).reduce((a,b) => a + b),
          'lastFinish': moment(Date.now()).diff(moment(lastResults[0].timeStarted), 'seconds'),
          'fetches': lastResults.map(f => {
            return {
              'duration': moment(f.timeEnded).diff(moment(f.timeStarted), 'seconds'),
              'failures': flatten(f.results.map(s => {
                let fails = []
                for (let fail in s.failures) {
                  fails.push(`${s.sourceName} - ${fail} (${s.failures[fail]} failed)`)
                }
                return fails
              })),
              'measurements': f.count,
              'sources': f.results.length,
              'timeAgo': moment(f.timeEnded).fromNow()
            }
          })
        })
      }).catch(err => {
        console.log(err)
      })
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
                  <dl className='dl-horizontal'>
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
            )
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

          {this.renderFetchSummary()}

        </div>
      </section>
    );
  }
});

module.exports = StatusFetch;
