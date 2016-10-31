'use strict';
var logo = require('./logo');
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  consoleMessage: logo,
  apiBase: 'https://api.openaq.org',
  apiVersion: '/v1',
  apiDocs: 'https://docs.openaq.org'
};

