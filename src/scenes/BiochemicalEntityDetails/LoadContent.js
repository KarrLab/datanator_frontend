import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import { Link } from "react-router-dom";
import { httpRequestLog } from "~/utils/utils";

class LoadExternalContent extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    "format-results": PropTypes.func.isRequired,
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
    httpRequestLog.push(this.props.url);
    axios
      .get(this.props.url, {
        headers: { "Content-Type": "application/json" },
        cancelToken: this.cancelTokenSource.token,
      })
      .then((response) => {
        const processed_data = this.props["format-results"](response.data);
        this.setState({ text: processed_data });
      })
      .catch((error) => {
        genApiErrorHandler([this.props.url], "Unable to load metadata.")(error);
      })
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  render() {
    if (this.state.text == null) {
      return <div className="loader"></div>;
    } else if (this.state.text.length === 0) {
      return <div>No information is available.</div>;
    } else {
      return <div>{this.state.text}</div>;
    }
  }
}

class LoadContent extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    "format-results": PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.cancelTokenSource = null;
    this.results = null;

    this.state = {
      results: null,
      locationPathname: "",
    };
  }

  componentDidMount() {
    this.results = null;
    this.setState({
      results: null,
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
      .then((response) => {
        let results = this.props["format-results"](response.data);
        this.results = results;

        this.setState({
          results: results,
        });
      })
      .catch((error) => {
        genApiErrorHandler(
          [url],
          "We were unable to conduct your search for '" + this.query + "'."
        )(error);
      })
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  render() {
    const results = this.state.results;
    if (results == null) {
      return <div className="loader"></div>;
    } else if (results.length === 0) {
      return <div>No information is available.</div>;
    } else {
      return <div>{this.state.results}</div>;
    }
  }
}

class LoadMetabolites extends Component {
  static propTypes = {
    url: PropTypes.string,
    name: PropTypes.string.isRequired,
    route: PropTypes.string,
    inchiKey: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.cancelTokenSource = null;

    this.state = {
      results: this.props.name,
    };
  }

  componentDidMount() {
    this.setState({
      results: this.props.name,
    });
    this.fetchResults();
  }

  static processRelatedMetabolites(route, name, metadata) {
    if (Object.keys(metadata).length > 0) {
      return (
        <Link key={"substrate-" + name} to={route}>
          {name}
        </Link>
      );
    } else {
      return name;
    }
  }

  fetchResults() {
    this.setState({ results: this.props.name });
    const url = this.props["url"];

    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    this.cancelTokenSource = axios.CancelToken.source();
    if (this.props.inchiKey !== null) {
      getDataFromApi([url], { cancelToken: this.cancelTokenSource.token })
        .then((response) => {
          let results = LoadMetabolites.processRelatedMetabolites(
            this.props.route,
            this.props.name,
            response.data
          );
          this.results = results;

          this.setState({
            results: results,
          });
        })
        .catch((error) => {
          genApiErrorHandler(
            [url],
            "We were unable to conduct your search for '" + this.query + "'."
          )(error);
        })
        .finally(() => {
          this.cancelTokenSource = null;
        });
    }
  }

  render() {
    return <div className="metabolite-link">{this.state.results}</div>;
  }
}

export { LoadExternalContent, LoadContent, LoadMetabolites };
