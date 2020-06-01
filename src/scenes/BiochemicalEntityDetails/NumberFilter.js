import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "@material-ui/core/Slider";
import { formatScientificNotation } from "~/utils/utils";

class NumberFilter extends Component {
  static propTypes = {
    api: PropTypes.shape({
      addEventListener: PropTypes.func.isRequired,
      removeEventListener: PropTypes.func.isRequired,
      forEachNode: PropTypes.func.isRequired,
    }).isRequired,
    valueGetter: PropTypes.func.isRequired,
    loBound: PropTypes.number,
    hiBound: PropTypes.number,
    step: PropTypes.number,
    filterChangedCallback: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loBound: null,
    hiBound: null,
    step: null,
  };

  constructor(props) {
    super(props);

    this.loBound = 0;
    this.hiBound = 1;
    this.min = this.loBound;
    this.max = this.hiBound;
    this.state = {
      loBound: this.loBound,
      hiBound: this.hiBound,
      min: this.min,
      max: this.max,
      marks: [
        {
          value: this.loBound,
          label: formatScientificNotation(this.loBound, 4, 3, 1, 1, 3),
        },
        {
          value: this.hiBound,
          label: formatScientificNotation(this.hiBound, 4, 3, 1, 1, 3),
        },
      ],
      step: 0.01,
      disabled: false,
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
      this.props.api.forEachNode((node) => {
        const value = this.props.valueGetter(node);
        if (value != null && value !== undefined && !isNaN(value)) {
          loBound = Math.min(loBound, value);
          hiBound = Math.max(hiBound, value);
        }
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

    let marks = [this.loBound, this.hiBound];

    let step;
    if (this.props.step != null) {
      step = this.props.step;
    } else if (this.hiBound === this.loBound) {
      if (this.hiBound === 0) {
        step = 1e2;
      } else {
        step = Math.pow(10, Math.floor(Math.log10(this.hiBound)) - 2);
      }
    } else {
      step = Math.pow(
        10,
        Math.floor(Math.log10(this.hiBound - this.loBound)) - 1
      );
    }

    let disabled = false;
    if (!isFinite(this.loBound)) {
      marks = [];
      disabled = true;
    } else if (this.loBound === this.hiBound) {
      marks = [this.min];
      this.min -= step;
      this.max += step;
      this.loBound -= step;
      this.hiBound += step;
    }

    this.setState({
      loBound: this.loBound,
      hiBound: this.hiBound,
      min: this.min,
      max: this.max,
      marks: marks.map((mark) => {
        return {
          value: mark,
          label: formatScientificNotation(mark, 4, 3, 1, 1, 3),
        };
      }),
      step: step,
      disabled: disabled,
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
      max: this.max,
    };
  }

  setModel(range) {
    if (range == null) {
      this.min = this.loBound;
      this.max = this.hiBound;
    } else {
      const rangeMin = range.min != null ? range.min : this.loBound;
      const rangeMax = range.max != null ? range.max : this.hiBound;

      this.min = Math.min(Math.max(this.loBound, rangeMin), this.hiBound);
      this.max = Math.min(Math.max(this.loBound, rangeMax), this.hiBound);

      if (this.min > this.max) {
        const tmp = this.min;
        this.min = this.max;
        this.max = tmp;
      }
    }
    this.setState({
      min: this.min,
      max: this.max,
    });
    this.props.filterChangedCallback();
  }

  onChange(event, range) {
    let min = range[0];
    let max = range[1];

    if (min > max) {
      const temp = min;
      min = max;
      max = temp;
    }

    if (this.min !== min || this.max !== max) {
      this.min = min;
      this.max = max;
      this.setState({
        min: this.min,
        max: this.max,
      });
      this.props.filterChangedCallback();
    }
  }

  render() {
    return (
      <div className="biochemical-entity-scene-filter biochemical-entity-scene-slider-filter biochemical-entity-scene-normal-slider-filter biochemical-entity-scene-horizontal-slider-filter number-slider-filter">
        <Slider
          ref={this.slider}
          min={this.state.loBound}
          max={this.state.hiBound}
          step={this.state.step}
          marks={this.state.marks}
          value={[this.state.min, this.state.max]}
          orientation="horizontal"
          track="normal"
          valueLabelDisplay={"on"}
          onChange={this.onChange}
          getAriaLabel={this.getAriaLabel}
          valueLabelFormat={this.valueText}
          getAriaValueText={this.valueText}
          disabled={this.state.disabled}
        />
      </div>
    );
  }

  getAriaLabel(index) {
    if (index === 0) {
      return "Minimum";
    } else {
      return "Maximum";
    }
  }

  valueText(value) {
    return formatScientificNotation(value, 4, 3, 1, 1, 3);
  }
}

export { NumberFilter };
