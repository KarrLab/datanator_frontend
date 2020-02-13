import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "@material-ui/core/Slider";

const marks = [
  {
    value: 0.6,
    label: "0.6"
  },
  {
    value: 1,
    label: "1.0"
  }
];

function valueText(value) {
  return `${value}`;
}

class TanimotoFilter extends Component {
  static propTypes = {
    agGridReact: PropTypes.object.isRequired,
    valueGetter: PropTypes.func.isRequired,
    filterChangedCallback: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.minSimilarity = 0.6;
    this.state = {
      minSimilarity: this.minSimilarity
    };

    this.slider = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  isFilterActive() {
    return true;
  }

  doesFilterPass(params) {
    return this.props.valueGetter(params.node) >= this.minSimilarity;
  }

  getModel() {
    return this.minSimilarity;
  }

  setModel(minSimilarity) {
    if (minSimilarity == null) {
      this.minSimilarity = marks[0].value;
    } else {
      this.minSimilarity = Math.min(
        Math.max(marks[0].value, minSimilarity),
        marks[1].value
      );
    }
    this.setState({ minSimilarity: this.minSimilarity });
    this.props.filterChangedCallback();
  }

  // Method could be used to dynamically set the min/max of the slider to the min/max Tanimoto similarity of all of the rows
  // onNewRowsLoaded() {}

  onChange(event, minSimilarity) {
    if (this.minSimilarity !== minSimilarity) {
      this.minSimilarity = minSimilarity;
      this.setState({ minSimilarity: this.minSimilarity });
      this.props.filterChangedCallback();
    }
  }

  render() {
    return (
      <div className="tool-panel-slider tool-panel-inverted-slider tool-panel-horizontal-slider tanimoto-tool-panel-slider">
        <Slider
          ref={this.slider}
          min={marks[0].value}
          max={marks[1].value}
          step={0.01}
          marks={marks}
          value={this.state.minSimilarity}
          orientation="horizontal"
          track="inverted"
          valueLabelDisplay={"on"}
          onChange={this.onChange}
          aria-label="Tanimoto slider"
          getAriaValueText={valueText}
        />
      </div>
    );
  }
}

export { TanimotoFilter };
