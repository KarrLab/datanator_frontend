// React Libraries
import React from "react";
import ReactDOM from "react-dom";
//Router (enables persistant URLS and History)
import { BrowserRouter, Route } from "react-router-dom";

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

// Common page components
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";

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

// Setup Font Awesome icon library
library.add(faAtom, faDna);

const SiteRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <div>
        <Route path="/" exact component={Home} />
        <Route path="/search/" component={SearchResults} />
        <Route
          path="/metabolite/:molecule/:organism/:abstract?/"
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
      </div>
      <Footer />
    </BrowserRouter>
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
