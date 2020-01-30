//react store setup
import { applyMiddleware, createStore } from "redux";

//For react firefox/chrome webtools
import { composeWithDevTools } from "redux-devtools-extension";

//Third Party Middleware options
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

// Reducers defined for the app
import reducer from "./reducers";

//create middleware
const middleware = [promise, thunk];
if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}
const enhancers = applyMiddleware(...middleware);

//set up firefox dev tools
const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  trace: true
});

export default createStore(reducer, composeEnhancers(enhancers));
