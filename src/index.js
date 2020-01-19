// React Libraries
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

//Router (enables persistant URLS and History)
import { BrowserRouter as Router, Route } from "react-router-dom";

//Redux (used for state management)
import { Provider } from "react-redux";
import store from "~/data/Store";

//Styles for @Blueprint JS (Template Components)
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
//import '@blueprintjs/select/lib/css/blueprint-select.css';
//import '@blueprintjs/table/lib/css/table.css';
import "@blueprintjs/core/lib/scss/variables.scss";
import "./index.scss";

// Font Awesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAtom, faDna } from "@fortawesome/free-solid-svg-icons";

// Website pages (scenes)
import Home from "~/scenes/Home/Home";
import SearchResults from "~/scenes/SearchResults/SearchResults";
import MetabConcs from "~/scenes/Results/MetabConcs";
import ProteinPage from "~/scenes/Results/ProteinPage";
import ReactionPage from "~/scenes/Results/ReactionPage";
import About from "~/scenes/About/About";

// Setup Font Awesome icon library
library.add(faAtom, faDna);

const SiteRouter = () => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/search/" component={SearchResults} />
      <Route
        path="/metabconcs/:molecule/:organism/:abstract?/"
        component={MetabConcs}
      />
      <Route
        path="/protein/:searchType/:molecule/:organism?/"
        component={ProteinPage}
      />
      <Route path="/reaction/:dataType/" component={ReactionPage} />
      <Route path="/about/" component={About} />
    </Router>
  );
};
const SiteProvider = () => {
  return (
    <Provider store={store}>
      <SiteRouter />
    </Provider>
  );
};

SiteProvider.propTypes = {
  store: PropTypes.object.isRequired
};

ReactDOM.render(<SiteProvider />, document.getElementById("root"));
