import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import axios from "axios";

class SearchResultsList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    "format-results": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.unlistenToHistory = null;
    this.cancelTokenSource = null;
    this.results = null;

    this.state = {
      results: null,
      locationPathname: ""
    };
  }

  componentDidMount() {
    this.results = null;
    this.setState({
      results: null
    });
    this.fetchResults();
  }

  fetchResults() {
    const url = this.props["url"];

    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    this.cancelTokenSource = axios.CancelToken.source();
    getDataFromApi([url], { cancelToken: this.cancelTokenSource.token })
      .then(response => {
        let results = this.props["format-results"](
          response.data,
          this.props.organism
        );
        this.results = results;

        this.setState({
          results: results
        });
      })
      .catch(
        genApiErrorHandler(
          [url],
          "We were unable to conduct your search for '" + this.query + "'."
        )
      )
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  render() {
    const results = this.state.results;
    console.log(results);

    if (results == null) {
      return <div className="loader"></div>;
    } else {
      return (
        <div>
          <ul className="two-col-list link-list">
            {results.map(el => {
              return (
                <li key={el.name}>
                  <Link to={el.route}>{el.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  }
}

export default withRouter(SearchResultsList);
