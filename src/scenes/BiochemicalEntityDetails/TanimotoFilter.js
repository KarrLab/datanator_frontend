import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ReactDOM from "react-dom";

const iOSBoxShadow =
  "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)";

function valuetext(value) {
  return `${value}`;
}

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

class TanimotoFilter extends Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();

    this.state = {
      filter: "",
      numToNode: null,
      marks: [],
      buttons: []
    };

    this.valueGetter = this.props.valueGetter;

    this.onChange = this.onChange.bind(this);
    this.isFilterActive = this.isFilterActive.bind(this);
    this.formatButtons = this.formatButtons.bind(this);
    this.setMarks = this.setMarks.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
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
    let lineage = this.props.agGridReact.props.lineage;
    let buttons = [];
    var new_marks = [];
    var new_numToNode = {};
    var n = lineage.length - 1;
    for (var i = 0; i < lineage.length; i++) {
      //new_numToNode[Object.values(lineage[i])[0]] = Object.keys(lineage[i])[0];
      new_numToNode[i] = Object.values(lineage[i])[0];
      new_marks.push({ value: i, label: Object.keys(lineage[i])[0] });
      buttons.push(
        <div>
          {" "}
          <input
            type="radio"
            name="gender"
            value={Object.values(lineage[i])[0]}
          ></input>
          <label>{Object.keys(lineage[i])[0]}</label>
        </div>
      );

      //buttons.push(<input type="radio" name="gender" value={Object.values(lineage[i])[0]}> {Object.keys(lineage[i])[0]} </input>)
    }

    this.setState({
      numToNode: new_numToNode,
      buttons: buttons,
      marks: new_marks
    });
  }

  isFilterActive2() {
    return this.state.filter !== "";
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
    this.state.text = model ? model.value : "";
  }

  afterGuiAttached(params) {
    this.focus();
  }

  focus() {
    window.setTimeout(() => {
      let container = ReactDOM.findDOMNode(this.refs.input);
      if (container) {
        container.focus();
      }
    });
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

  formatButtons(lineage) {
    let buttons = [];
    for (var i = this.state.marks.length - 1; i >= 0; i--) {
      buttons.push(
        <input type="radio" name="gender" value="male">
          {" "}
          this.state.marks[i]{" "}
        </input>
      );
    }
    return buttons;
  }

  sliderChange(value) {
    this.setState({ filter: 7 });
  }

  render() {
    let buttons = this.state.buttons;
    return (
      <div className={"biochemical-entity-scene-slider-filter biochemical-entity-scene-tanimoto-slider-filter"}>
        <IOSSlider
          onChange={this.onChange}
          orientation="horizontal"
          aria-labelledby="horizontal-slider"
          getAriaValueText={valuetext}
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
