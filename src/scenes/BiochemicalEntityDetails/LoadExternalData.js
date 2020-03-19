import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { genApiErrorHandler } from "~/services/RestApi";

class LoadExternalData extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    processor: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { text: "" };
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
        const processed_data = this.props.processor(response.data);
        this.setState({ text: processed_data });
      })
      .catch(genApiErrorHandler([this.props.url], "Unable to load metadata."))
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  render() {
    return <div>{this.state.text}</div>;
  }
}

export { LoadExternalData };
