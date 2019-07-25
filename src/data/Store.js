//react store setup
import { applyMiddleware, createStore } from 'redux';

//For react firefox/chrome webtools
import { composeWithDevTools } from 'redux-devtools-extension';

//Third Party Middleware options
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

// Reducers defined for the app
import reducer from './reducers';

//create middleware
const middleware = applyMiddleware(promise, thunk, logger);

//set up firefox dev tools
const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

export default createStore(reducer, composeEnhancers(middleware));
