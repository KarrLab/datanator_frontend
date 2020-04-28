import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";

class LoadExternalContent extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    "format-results": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { text: null };
    this.cancelTokenSource = null;
  }

  componentWillUnmount() {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
  }

  componentDidMount() {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
    this.cancelTokenSource = axios.CancelToken.source();
    axios
      .get(this.props.url, {
        headers: { "Content-Type": "application/json" },
        cancelToken: this.cancelTokenSource.token
      })
      .then(response => {
        const processed_data = this.props["format-results"](response.data);
        this.setState({ text: processed_data });
      })
      .catch(genApiErrorHandler([this.props.url], "Unable to load metadata."))
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  render() {
    if (this.state.text === null) {
      return <div className="loader"></div>;
    } else if (this.state.text.length == 0) {
      return <div>No data is available.</div>;
    } else {
      return <div>{this.state.text}</div>;
    }
  }
}

class LoadContent extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    "format-results": PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

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
        let results = this.props["format-results"](response.data);
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
    if (results == null) {
      return <div className="loader"></div>;
    } else if (results.length == 0) {
      return <div>No data is available.</div>;
    } else {
      return <div>{this.state.results}</div>;
    }
  }
}

export { LoadExternalContent, LoadContent };
