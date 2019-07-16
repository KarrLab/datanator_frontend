import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './scenes/App/App';
import {Logo} from './components/Logo/'
import * as serviceWorker from './services/serviceWorker';

ReactDOM.render(<Logo height="300" width="600" />, document.getElementById('root'));
ReactDOM.render(<Logo/>, document.getElementById('header'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
