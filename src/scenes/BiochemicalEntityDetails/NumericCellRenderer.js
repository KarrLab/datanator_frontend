import React, { Component } from "react";
import PropTypes from "prop-types";
import { formatScientificNotation } from "~/utils/utils";

export class NumericCellRenderer extends Component {
  static propTypes = {
    value: PropTypes.number
  };

  render() {
    return (
      <span className="ag-numeric-cell">
        {formatScientificNotation(this.props.value, 4, 3, 1, 1, 3)}
      </span>
    );
  }
}
