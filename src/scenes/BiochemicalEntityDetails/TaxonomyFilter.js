import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "@material-ui/core/Slider";
import { upperCaseFirstLetter } from "~/utils/utils";

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
      marks: [],
      selectedMarkValue: 0,
      maxDistance: null
    };

    this.markValueToDistance = null;
    this.filterModel = null;

    this.onChange = this.onChange.bind(this);
  }

  isFilterActive() {
    return true;
  }

  componentDidMount() {
    if (this.props.agGridReact.props["taxon-lineage"] != null) {
      this.setMarks();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.agGridReact.props["taxon-lineage"] !==
      prevProps.agGridReact.props["taxon-lineage"]
    ) {
      this.setMarks();
    }
  }

  setMarks() {
    const lineage = this.props.agGridReact.props["taxon-lineage"];
    const marks = [];
    this.markValueToDistance = {};
    for (let iLineage = 0; iLineage < lineage.length; iLineage++) {
      const taxon = Object.keys(lineage[iLineage])[0];
      const distance = Object.values(lineage[iLineage])[0];
      marks.push({
        value: iLineage,
        label: upperCaseFirstLetter(taxon)
      });
      this.markValueToDistance[iLineage] = distance;
    }

    this.setState({
      marks: marks,
      selectedMarkValue: Math.max(marks.length - 1)
    });
  }

  doesFilterPass(params) {
    const maxDistance = this.state.maxDistance;
    const distance = this.props.valueGetter(params.node);
    return distance <= maxDistance;
  }

  getModel() {
    return this.filterModel;
  }

  setModel(model) {
    this.filterModel = model;
  }

  afterGuiAttached() {}

  onChange(event, selectedMarkValue) {
    const maxDistance = this.markValueToDistance[selectedMarkValue];
    if (this.state.maxDistance !== maxDistance) {
      this.setState(
        {
          selectedMarkValue: selectedMarkValue,
          maxDistance: maxDistance
        },
        () => {
          this.props.filterChangedCallback();
        }
      );
    }
  }

  render() {
    const marks = this.state.marks;
    const max = Math.max(0, marks.length - 1);
    const selectedMarkValue = this.state.selectedMarkValue;
    const sliderContainer = (
      <div className="tool-panel-slider tool-panel-normal-slider tool-panel-vertical-slider taxonomy-tool-panel-slider">
        <Slider
          min={0}
          max={max}
          step={1}
          marks={marks}
          value={selectedMarkValue}
          orientation="vertical"
          valueLabelDisplay={"on"}
          onChange={this.onChange}
          aria-label="Taxonomy slider"
          getAriaValueText={valueText}
        />
      </div>
    );
    return sliderContainer;
  }
}

export { TaxonomyFilter };
