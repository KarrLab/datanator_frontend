// React Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

//Router (enables persistant URLS and History)
import { BrowserRouter as Router, Route } from 'react-router-dom';

//Redux (used for state management)
import { Provider } from 'react-redux';
import store from '~/data/Store';

//Styles for @Blueprint JS (Template Components)
import './index.css';
import '../node_modules/@blueprintjs/core/lib/css/blueprint.css';
import '../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css';
import '../node_modules/@blueprintjs/select/lib/css/blueprint-select.css';
import '../node_modules/@blueprintjs/table/lib/css/table.css';
import '../node_modules/@blueprintjs/core/lib/scss/variables.scss';

//Website pages (scenes)
import { Home } from '~/scenes/Home/Home';
import HomeOld from '~/scenes/Home/HomeOld';
import Search from '~/scenes/Search/Search';
import Metabconcs from '~/scenes/Results/Metabconcs';

const SiteRouter = () => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/search/" component={Search} />
      <Route path="/old" component={HomeOld} />
      <Route
        path="/metabconcs/:molecule/:organism/:abstract?/"
        component={Metabconcs}
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
