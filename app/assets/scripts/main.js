'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

import App from './views/app';

render(<App />, document.querySelector('#app-container'));
