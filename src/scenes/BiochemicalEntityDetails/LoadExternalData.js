import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

class LoadData extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    processor: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }
  componentDidMount() {
    axios
      .get(this.props.url, { headers: { "Content-Type": "application/json" } })
      .then(response => {
        console.log(response.data);
        const processed_data = this.props.processor(response.data);
        this.setState({ text: processed_data });
      });
  }

  render() {
    return <div>{this.state.text}</div>;
  }
}

export { LoadData };
