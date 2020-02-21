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
    filterChangedCallback: PropTypes.func.isRequired,
    colDef: PropTypes.shape({
      filterParams: PropTypes.shape({
        taxonLineage: PropTypes.array.isRequired
      }).isRequired
    }).isRequired,
    taxonLineage: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.selectedMarkValue = 0;
    this.maxDistance = null;
    this.state = {
      marks: [],
      selectedMarkValue: this.selectedMarkValue,
      maxDistance: null
    };

    this.markValueToDistance = null;

    this.onChange = this.onChange.bind(this);
  }

  isFilterActive() {
    return this.maxDistance < this.markValueToDistance.length - 1;
  }

  componentDidMount() {
    if (this.getTaxonLineage(this.props).length > 0) {
      this.setMarks();
    }
  }

  componentDidUpdate(prevProps) {
    const lineage = this.getTaxonLineage(this.props);
    const prevLineage = this.getTaxonLineage(prevProps);

    if (lineage !== prevLineage) {
      this.setMarks();
    }
  }

  getTaxonLineage(props) {
    let lineage = props.taxonLineage;

    // the following two statments are necessary because the taxonLineage property doesn't appear to be set correctly in cypress tests
    if (lineage.length === 0) {
      lineage = props.colDef.filterParams.taxonLineage;
    }
    if (lineage.length === 0) {
      lineage =
        props.agGridReact.gridOptions.columnDefs[5].filterParams.taxonLineage;
    }

    return lineage;
  }

  setMarks() {
    const lineage = this.getTaxonLineage(this.props);
    const marks = [];
    const markValueToDistance = [];
    for (let iLineage = 0; iLineage < lineage.length; iLineage++) {
      const taxon = Object.keys(lineage[iLineage])[0];
      const distance = Object.values(lineage[iLineage])[0];
      marks.push({
        value: iLineage,
        label: upperCaseFirstLetter(taxon)
      });
      markValueToDistance.push(distance);
    }

    this.selectedMarkValue = Math.max(marks.length - 1);
    this.maxDistance = markValueToDistance[this.selectedMarkValue];
    this.markValueToDistance = markValueToDistance;

    this.setState({
      marks: marks,
      selectedMarkValue: this.selectedMarkValue,
      maxDistance: this.maxDistance
    });
  }

  doesFilterPass(params) {
    const maxDistance = this.maxDistance;
    const distance = this.props.valueGetter(params.node);
    return distance <= maxDistance;
  }

  getModel() {
    return this.selectedMarkValue;
  }

  setModel(selectedMarkValue) {
    if (selectedMarkValue == null) {
      this.selectedMarkValue = this.markValueToDistance.length - 1;
    } else {
      this.selectedMarkValue = Math.round(
        Math.min(
          Math.max(0, selectedMarkValue),
          this.markValueToDistance.length - 1
        )
      );
    }
    this.maxDistance = this.markValueToDistance[this.selectedMarkValue];
    this.setState({
      selectedMarkValue: this.selectedMarkValue,
      maxDistance: this.maxDistance
    });
    this.props.filterChangedCallback();
  }

  // Method could be used to dynamically set the min/max of the slider to the min/max similarity of all of the rows
  // onNewRowsLoaded() {}

  onChange(event, selectedMarkValue) {
    const maxDistance = this.markValueToDistance[selectedMarkValue];
    if (this.maxDistance !== maxDistance) {
      this.selectedMarkValue = selectedMarkValue;
      this.maxDistance = maxDistance;
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
      <div className="biochemical-entity-scene-slider-filter biochemical-entity-scene-normal-slider-filter biochemical-entity-scene-vertical-slider-filter biochemical-entity-scene-taxonomy-slider-filter">
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
