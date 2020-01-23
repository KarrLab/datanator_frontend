import React, { Component } from "react";
import PropTypes from "prop-types";
import { StatsToolPanel as BaseStatsToolPanel } from "../StatsToolPanel/StatsToolPanel";

export default class StatsToolPanel extends Component {
  static propTypes = {
    "relevant-column": PropTypes.string.isRequired
  };

  render() {
    return (
      <BaseStatsToolPanel relevant-column={this.props["relevant-column"]} />
    );
  }
}
