// React Libraries
import React from "react";
import ReactDOM from "react-dom";
// Router (enables persistant URLs and History)
import { Router, Route } from "react-router-dom";

// Redux (used for state management)
import { Provider } from "react-redux";
import store from "~/data/Store";
import history from "~/utils/history";

// Feedback form
import { applyPolyfills, defineCustomElements } from '@bruit/component/loader';

// Styles for @Blueprint JS (Template Components)
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/scss/variables.scss";
import "./index.scss";

// Font Awesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAtom, faDna, faBug } from "@fortawesome/free-solid-svg-icons";

// Common page components
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import FeedbackForm from "~/components/FeedbackForm/FeedbackForm";

// Website pages (scenes)
import Home from "~/scenes/Home/Home";
import SearchResults from "~/scenes/SearchResults/SearchResults";
import Metabolite from "~/scenes/BiochemicalEntityDetails/Metabolite/Metabolite";
// import Rna from "~/scenes/BiochemicalEntityDetails/Rna/Rna";
import Protein from "~/scenes/BiochemicalEntityDetails/Protein/Protein";
import Reaction from "~/scenes/BiochemicalEntityDetails/Reaction/Reaction";
import Stats from "~/scenes/Stats/Stats";
import Help from "~/scenes/Help/Help";
import About from "~/scenes/About/About";
import Error404 from "~/scenes/Error404/Error404";

// Setup Font Awesome icon library
library.add(faAtom, faDna, faBug);

// Render site
const SiteRouter = () => {
  return (
    <Router history={history}>
      <Header />
      <div>
        <Route path="/" exact component={Home} />
        <Route path="/search/:query/:organism?/" component={SearchResults} />
        <Route
          path="/metabolite/:molecule/:organism?/"
          component={Metabolite}
        />
        <Route
          path="/protein/:searchType/:molecule/:organism?/"
          component={Protein}
        />
        <Route path="/reaction/:dataType/" component={Reaction} />
        <Route path="/stats/" component={Stats} />
        <Route path="/help/" component={Help} />
        <Route path="/about/" component={About} />
        <Route path="*">
          <Error404 />
        </Route>
      </div>
      <Footer />
      <FeedbackForm />
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

ReactDOM.render(<SiteProvider />, document.getElementById("root"));

applyPolyfills().then(() => {
  defineCustomElements(window);
});
