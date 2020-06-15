// React Libraries
import React from "react";
import ReactDOM from "react-dom";
// Router (enables persistant URLs and History)
import { Router, Switch, Route, Redirect } from "react-router-dom";

// Redux (used for state management)
import history from "~/utils/history";

// Feedback form
import { applyPolyfills, defineCustomElements } from "@bruit/component/loader";

// Styles for @Blueprint JS (Template Components)
import "./index.scss";
import "./index.mobile.scss";

// Font Awesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAtom,
  faDna,
  faBug,
  faEnvelope,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

// Common page components
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import FeedbackForm from "~/components/FeedbackForm/FeedbackForm";
import { errorDialog } from "~/components/ErrorDialog/ErrorDialog";
import ErrorBoundary from "~/components/ErrorBoundary/ErrorBoundary";

// Website pages (scenes)
import Home from "~/scenes/Home/Home";
import SearchResults from "~/scenes/SearchResults/SearchResults";
import Metabolite from "~/scenes/BiochemicalEntityDetails/Metabolite/Metabolite";
import Gene from "~/scenes/BiochemicalEntityDetails/Gene/Gene";
import Reaction from "~/scenes/BiochemicalEntityDetails/Reaction/Reaction";
import Stats from "~/scenes/Stats/Stats";
import Help from "~/scenes/Help/Help";
import About from "~/scenes/About/About";
import Error404 from "~/scenes/Error404/Error404";

// Setup Font Awesome icon library
library.add(faAtom, faDna, faBug, faEnvelope, faExclamationCircle);

// Render site
const SiteRouter = () => {
  return (
    <ErrorBoundary>
      <Router history={history}>
        <Header />
        <Switch>
          {/* Add trailing slash */}
          <Route
            path={/^.*?(?<!\/)$/}
            exact
            render={({ location }) => {
              return <Redirect to={location.pathname + "/"} />;
            }}
          />

          {/* Remove duplicate slashes */}
          <Route
            path="(.*//+.*)"
            exact
            render={({ match }) => {
              return <Redirect to={match.url.replace(/\/\/+/, "/")} />;
            }}
          />

          <Route path="/" exact strict component={Home} />

          <Route
            path="/search/:query/:organism/"
            exact
            strict
            component={SearchResults}
          />
          <Route
            path="/search/:query/"
            exact
            strict
            component={SearchResults}
          />

          <Route
            path="/metabolite/:metabolite/:organism/"
            exact
            strict
            component={Metabolite}
          />
          <Route
            path="/metabolite/:metabolite/"
            exact
            strict
            component={Metabolite}
          />

          <Route path="/gene/:gene/:organism/" exact strict component={Gene} />
          <Route path="/gene/:gene/" exact strict component={Gene} />

          <Route
            path="/reaction/:reaction/:organism/"
            exact
            strict
            component={Reaction}
          />
          <Route
            path="/reaction/:reaction/"
            exact
            strict
            component={Reaction}
          />

          <Route path="/stats/" exact strict component={Stats} />
          <Route path="/help/" exact strict component={Help} />
          <Route path="/about/" exact strict component={About} />
          <Route path="*" component={Error404} />
        </Switch>
        <Footer />
        {errorDialog}
        <FeedbackForm />
      </Router>
    </ErrorBoundary>
  );
};

ReactDOM.render(<SiteRouter />, document.getElementById("root"));

applyPolyfills().then(() => {
  defineCustomElements(window);
});
