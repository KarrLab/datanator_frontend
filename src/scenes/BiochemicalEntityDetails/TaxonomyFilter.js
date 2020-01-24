import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "@material-ui/core/Slider";

function valueText(value) {
  return `${value}`;
}

class TaxonomyFilter extends Component {
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

    this.filterModel = null;

    this.onChange = this.onChange.bind(this);
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
    const value = this.props.valueGetter(params.node);
    return value <= filter;
  }

  getModel() {
    return this.filterModel;
  }

  setModel(model) {
    this.filterModel = model;
  }

  afterGuiAttached() {}

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

  render() {
    const marks = this.state.marks;
    return (
      <div className="tool-panel-slider tool-panel-normal-slider tool-panel-vertical-slider taxonomy-tool-panel-slider">
        <Slider
          min={0}
          max={marks.length - 1}
          step={1}
          marks={marks}
          orientation="vertical"
          valueLabelDisplay={"on"}
          onChange={this.onChange}
          aria-label="Taxonomy slider"
          getAriaValueText={valueText}
        />
      </div>
    );
  }
}

export { TaxonomyFilter };
