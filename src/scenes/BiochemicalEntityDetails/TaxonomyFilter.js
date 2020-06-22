import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "@material-ui/core/Slider";
import { upperCaseFirstLetter } from "~/utils/utils";
import axios from "axios";
import { getDataFromApi, genApiErrorHandler } from "~/services/RestApi";
import { parseHistoryLocationPathname } from "~/utils/utils";
import history from "~/utils/history";

function valueText(value) {
  return `${value}`;
}

class TaxonomyFilter extends Component {
  static propTypes = {
    agGridReact: PropTypes.object.isRequired,
    valueGetter: PropTypes.func.isRequired,
    filterChangedCallback: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.locationPathname = null;
    this.unlistenToHistory = null;
    this.cancelTokenSource = null;
    this.taxonLineage = [];
    this.selectedMarkValue = 0;
    this.maxDistance = null;
    this.state = {
      marks: [],
      selectedMarkValue: this.selectedMarkValue,
      maxDistance: null,
    };

    this.markValueToDistance = null;

    this.onChange = this.onChange.bind(this);
  }

  isFilterActive() {
    return this.maxDistance < this.markValueToDistance.length - 1;
  }

  componentDidMount() {
    this.locationPathname = history.location.pathname;
    this.unlistenToHistory = history.listen((location) => {
      if (location.pathname !== this.locationPathname) {
        this.locationPathname = history.location.pathname;
        this.updateStateFromLocation();
      }
    });
    this.updateStateFromLocation();
  }

  componentWillUnmount() {
    this.unlistenToHistory();
    this.unlistenToHistory = null;
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }
  }

  updateStateFromLocation() {
    if (this.unlistenToHistory) {
      this.taxonLineage = [];
      this.getDataFromApi();
    }
  }

  getDataFromApi() {
    const route = parseHistoryLocationPathname(history);
    const organism = route.organism;

    // cancel earlier query
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel();
    }

    this.cancelTokenSource = axios.CancelToken.source();
    getDataFromApi("taxon/canon_rank_distance_by_name/?name=" + organism, {
      cancelToken: this.cancelTokenSource.token,
    })
      .then((response) => {
        this.taxonLineage = response.data;
        this.setMarks();
      })
      .catch(
        genApiErrorHandler.bind(
          null,
          "taxon/canon_rank_distance_by_name/?name=" + organism,
          "Unable to obtain taxonomic information about '" + organism + "'."
        )
      )
      .finally(() => {
        this.cancelTokenSource = null;
      });
  }

  setMarks() {
    const lineage = this.taxonLineage;
    const marks = [];
    const markValueToDistance = [];
    for (let iLineage = 0; iLineage < lineage.length; iLineage++) {
      const taxon = Object.keys(lineage[iLineage])[0];
      marks.push({
        value: iLineage,
        label: upperCaseFirstLetter(taxon),
      });
      markValueToDistance.push(iLineage);
    }

    this.selectedMarkValue = Math.max(marks.length - 1);
    this.maxDistance = markValueToDistance[this.selectedMarkValue];
    this.markValueToDistance = markValueToDistance;

    this.setState({
      marks: marks,
      selectedMarkValue: this.selectedMarkValue,
      maxDistance: this.maxDistance,
    });
  }

  doesFilterPass(params) {
    const maxDistance = this.maxDistance;
    if (this.maxDistance === this.markValueToDistance.length - 1) {
      return true;
    }

    const distance = this.props.valueGetter(params.node);
    if (distance == null) {
      return false;
    }

    return distance <= maxDistance;
  }

  getModel() {
    return {
      markValueToDistance: this.markValueToDistance,
      selectedMarkValue: this.selectedMarkValue,
    };
  }

  setModel(model) {
    if (model && "markValueToDistance" in model) {
      this.markValueToDistance = model.markValueToDistance;
    }

    let selectedMarkValue;
    if (model && "selectedMarkValue" in model) {
      selectedMarkValue = model.selectedMarkValue;
    } else {
      selectedMarkValue = null;
    }

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
      maxDistance: this.maxDistance,
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
          maxDistance: maxDistance,
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
      <div className="biochemical-entity-scene-filter biochemical-entity-scene-slider-filter biochemical-entity-scene-normal-slider-filter biochemical-entity-scene-vertical-slider-filter biochemical-entity-scene-taxonomy-slider-filter">
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
