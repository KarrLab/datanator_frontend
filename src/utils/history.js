import { createBrowserHistory } from "history";

const history = createBrowserHistory();

if (window.Cypress) {
  window.cypressHistory = history;
}

export default history;
