import React, { Component } from "react";
import { StatsToolPanel as BaseStatsToolPanel } from "../StatsToolPanel/StatsToolPanel";

export default class StatsToolPanel extends Component {
  constructor(props) {
    super(props);

    // calculate stats when new rows loaded, i.e. onModelUpdated
    // this.props.api.addEventListener(
    //   "modelUpdated",
    //   this.calcStats.bind(this)
    // );
  }

  render() {
    return <BaseStatsToolPanel relevant-column="abundance" />;
  }

  // calcStats() { }
}
