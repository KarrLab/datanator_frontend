// React Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

//Router (enables persistant URLS and History)
import { BrowserRouter as Router, Route } from 'react-router-dom';

//Redux (used for state management)
import { Provider } from 'react-redux';
import store from '~/data/Store';
import {Helmet} from "react-helmet";

//Styles for @Blueprint JS (Template Components)
import './index.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
//import '@blueprintjs/select/lib/css/blueprint-select.css';
//import '@blueprintjs/table/lib/css/table.css';
import '@blueprintjs/core/lib/scss/variables.scss';

//Website pages (scenes)
import Home from '~/scenes/Home/Home';
import Metabconcs from '~/scenes/Results/Metabconcs';
import ProteinPage from '~/scenes/Results/ProteinPage';
import ReactionPage from '~/scenes/Results/ReactionPage';
import GeneralPage from '~/scenes/Results/GeneralPage';
import AboutPage from '~/scenes/Results/AboutPage';

const SiteRouter = () => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route
        path="/metabconcs/:molecule/:organism/:abstract?/"
        component={Metabconcs}
      />
      <Route
        path="/protein/:searchType/:molecule/:organism?/"
        component={ProteinPage}
      />

      <Route
        path="/reaction/:dataType/"
        component={ReactionPage}
      />
      <Route
        path="/general/"
        component={GeneralPage}
      />
      <Route
        path="/about/"
        component={AboutPage}
      />

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
  store: PropTypes.object.isRequired,
};

ReactDOM.render(<SiteProvider />, document.getElementById('root'));
