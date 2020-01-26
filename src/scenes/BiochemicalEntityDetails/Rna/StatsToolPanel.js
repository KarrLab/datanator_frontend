import React, { Component } from "react";
import { StatsToolPanel as BaseStatsToolPanel } from "../StatsToolPanel/StatsToolPanel";

export default class StatsToolPanel extends Component {
  render() {
    return <BaseStatsToolPanel relevant-column="half_life" />;
  }
}
