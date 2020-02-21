import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "@material-ui/core/Slider";
import { formatScientificNotation } from "~/utils/utils";

class NumberFilter extends Component {
  static propTypes = {
    api: PropTypes.shape({
      addEventListener: PropTypes.func.isRequired,
      removeEventListener: PropTypes.func.isRequired,
      forEachNode: PropTypes.func.isRequired
    }).isRequired,
    valueGetter: PropTypes.func.isRequired,
    loBound: PropTypes.number,
    hiBound: PropTypes.number,
    step: PropTypes.number,
    filterChangedCallback: PropTypes.func.isRequired
  };

  static defaultProps = {
    loBound: null,
    hiBound: null,
    step: null
  };

  constructor(props) {
    super(props);

    this.loBound = 0;
    this.hiBound = 1;
    this.min = this.loBound;
    this.max = this.hiBound;
    this.state = {
      min: this.min,
      max: this.max,
      marks: [
        {
          value: this.loBound,
          label: formatScientificNotation(this.loBound, 4, 3, 1, 1, 3)
        },
        {
          value: this.hiBound,
          label: formatScientificNotation(this.hiBound, 4, 3, 1, 1, 3)
        }
      ],
      step: 0.01
    };

    this.slider = React.createRef();
    this.updateBounds = this.updateBounds.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.updateBounds();
    this.props.api.addEventListener("firstDataRendered", this.updateBounds);
    this.props.api.addEventListener("rowDataChanged", this.updateBounds);
    this.props.api.addEventListener("rowDataUpdated", this.updateBounds);
  }

  componentDidUpdate(prevProps) {
    if (this.props.api !== prevProps.api) {
      prevProps.api.removeEventListener("firstDataRendered", this.updateBounds);
      prevProps.api.removeEventListener("rowDataChanged", this.updateBounds);
      prevProps.api.removeEventListener("rowDataUpdated", this.updateBounds);

      this.updateBounds();
      this.props.api.addEventListener("firstDataRendered", this.updateBounds);
      this.props.api.addEventListener("rowDataChanged", this.updateBounds);
      this.props.api.addEventListener("rowDataUpdated", this.updateBounds);
    }

    if (
      this.props.loBound !== prevProps.loBound ||
      this.props.hiBound !== prevProps.hiBound
    ) {
      this.updateBounds();
    }
  }

  updateBounds() {
    this.loBound = this.props.loBound;
    this.hiBound = this.props.hiBound;

    if (this.loBound == null || this.hiBound == null) {
      let loBound = Infinity;
      let hiBound = -Infinity;
      this.props.api.forEachNode(node => {
        const value = this.props.valueGetter(node);
        loBound = Math.min(loBound, value);
        hiBound = Math.max(hiBound, value);
      });

      if (this.loBound == null) {
        this.loBound = loBound;
      }
      if (this.hiBound == null) {
        this.hiBound = hiBound;
      }
    }

    this.min = this.loBound;
    this.max = this.hiBound;

    let step;
    if (this.props.step != null) {
      step = this.props.step;
    } else {
      step = Math.pow(
        10,
        Math.floor(Math.log10(this.hiBound - this.loBound)) - 1
      );
    }

    this.setState({
      min: this.min,
      max: this.max,
      marks: [
        {
          value: this.loBound,
          label: formatScientificNotation(this.loBound, 4, 3, 1, 1, 3)
        },
        {
          value: this.hiBound,
          label: formatScientificNotation(this.hiBound, 4, 3, 1, 1, 3)
        }
      ],
      step: step
    });
  }

  isFilterActive() {
    return this.min > this.loBound || this.max < this.hiBound;
  }

  doesFilterPass(params) {
    const val = this.props.valueGetter(params.node);
    return this.min <= val && val <= this.max;
  }

  getModel() {
    return {
      min: this.min,
      max: this.max
    };
  }

  setModel(range) {
    if (range == null) {
      this.min = this.loBound;
      this.max = this.hiBound;
    } else {
      this.min = Math.min(Math.max(this.loBound, range.min), this.hiBound);
      this.max = Math.min(Math.max(this.loBound, range.max), this.hiBound);
      if (this.min > this.max) {
        const tmp = this.min;
        this.min = this.max;
        this.max = tmp;
      }
    }
    this.setState({
      min: this.min,
      max: this.max
    });
    this.props.filterChangedCallback();
  }

  // Method could be used to dynamically set the min/max of the slider to the min/max value of all of the rows
  // onNewRowsLoaded() {}

  onChange(event, min) {
    if (this.min !== min) {
      this.min = min;
      this.setState({ min: this.min });
      this.props.filterChangedCallback();
    }
  }

  render() {
    return (
      <div className="biochemical-entity-scene-slider-filter biochemical-entity-scene-inverted-slider-filter biochemical-entity-scene-horizontal-slider-filter number-slider-filter">
        <Slider
          ref={this.slider}
          min={this.state.marks[0].value}
          max={this.state.marks[1].value}
          step={this.state.step}
          marks={this.state.marks}
          value={this.state.min}
          orientation="horizontal"
          track="inverted"
          valueLabelDisplay={"on"}
          onChange={this.onChange}
          aria-label="Number slider"
          getAriaValueText={this.valueText}
        />
      </div>
    );
  }

  valueText(value) {
    return `${value}`;
  }
}

export { NumberFilter };
