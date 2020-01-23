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

    this.valueGetter = this.props.valueGetter;

    this.onChange = this.onChange.bind(this);
    this.isFilterActive = this.isFilterActive.bind(this);

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
    return value <= filter;
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
    let marks = this.state.marks;
    return (
      <div className="biochemical-entity-scene-taxonomy-slider-filter">
        <Slider
          ref={this.slider}
          onChange={this.onChange}
          orientation="vertical"
          aria-labelledby="vertical-slider"
          getAriaValueText={valueText}
          marks={marks}
          max={marks.length - 1}
        />
      </div>
    );
  }
}

export { TaxonomyFilter };
