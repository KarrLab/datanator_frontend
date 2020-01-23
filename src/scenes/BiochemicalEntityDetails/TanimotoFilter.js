import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "@material-ui/core/Slider";
import { withStyles } from "@material-ui/core/styles";

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

const marks = [
  {
    value: 0.65,
    label: "0.65"
  },
  {
    value: 1,
    label: "1"
  }
];

const IOSSlider = withStyles({
  root: {
    color: "#3880ff",
    height: 2,
    padding: "15px 0"
  },
  thumb: {
    height: 15,
    width: 15,
    backgroundColor: "#3f51b5;",
    boxShadow: iOSBoxShadow,
    marginTop: -7,
    marginLeft: -10,
    "&:focus,&:hover,&$active": {
      boxShadow:
        "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      // Reset on touch devices, it doesn't add specificity
      "@media (hover: none)": {
        boxShadow: iOSBoxShadow
      }
    }
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 11px)",
    top: -17,
    marginLeft: -15,
    "& *": {
      background: "transparent",
      color: "#000"
    }
  },
  track: {
    height: 2
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: "#bfbfbf"
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor"
  }
})(Slider);

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

    this.state = {
      filter: "",
      numToNode: null,
      marks: []
    };

    this.valueGetter = this.props.valueGetter;

    this.onChange = this.onChange.bind(this);
    this.isFilterActive = this.isFilterActive.bind(this);
    // this.setMarks = this.setMarks.bind(this);

    this.slider = React.createRef();
  }

  isFilterActive() {
    return true;
  }

  componentDidMount() {
    if (this.props.agGridReact.props.lineage != null) {
      this.setMarks();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.agGridReact.props.lineage !==
      prevProps.agGridReact.props.lineage
    ) {
      this.setMarks();
    }
  }

  setMarks() {
    const lineage = this.props.agGridReact.props.lineage;
    const marks = [];
    const numToNode = {};
    for (let i = 0; i < lineage.length; i++) {
      numToNode[i] = Object.values(lineage[i])[0];
      marks.push({
        value: i,
        label: Object.keys(lineage[i])[0]
      });
    }

    this.setState({
      numToNode: numToNode,
      marks: marks
    });
  }

  doesFilterPass(params) {
    const filter = this.state.filter;
    const value = this.valueGetter(params.node);
    return value >= filter;
  }

  getModel() {
    return { value: this.state.text };
  }

  setModel(model) {
    this.setState({ text: model ? model.value : "" });
  }

  afterGuiAttached() {
    this.slider.current.focus();
  }

  onChange(event, newValue) {
    let filter = newValue;
    if (this.state.filter !== filter) {
      this.setState(
        {
          filter: filter
        },
        () => {
          this.props.filterChangedCallback();
        }
      );
    }
  }

  render() {
    return (
      <div
        className={
          "biochemical-entity-scene-slider-filter biochemical-entity-scene-tanimoto-slider-filter"
        }
      >
        <IOSSlider
          ref={this.slider}
          onChange={this.onChange}
          orientation="horizontal"
          aria-labelledby="horizontal-slider"
          getAriaValueText={valueText}
          marks={marks}
          valueLabelDisplay={"on"}
          defaultValue={0.65}
          max={1}
          min={0.65}
          step={0.01}
        />
      </div>
    );
  }
}

export { TanimotoFilter };
