import React, { Component } from "react";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";
import store from "~/data/Store";
import ReactDOM from "react-dom";

const useStyles = makeStyles({
  slider: {
    height: 150
  }
});

function valuetext(value) {
  return `${value}`;
}

function VerticalSlider(marks) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Slider
          orientation="vertical"
          //defaultValue={[20, 37]}
          aria-labelledby="vertical-slider"
          getAriaValueText={valuetext}
          marks={marks}
        />
      </div>
    </React.Fragment>
  );
}

class TaxonomyFilter extends Component {
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

    return value <= filter;
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
    let filter = this.state.numToNode[newValue];
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
    let marks = this.state.marks;
    return (
      <div className={"slider_container"}>
        <div className={"slider_2"} style={{ height: 140 }}>
          <Slider
            onChange={this.onChange}
            orientation="vertical"
            aria-labelledby="vertical-slider"
            getAriaValueText={valuetext}
            marks={marks}
            max={marks.length - 1}
          />
        </div>
      </div>
    );
  }
}

export { TaxonomyFilter };
