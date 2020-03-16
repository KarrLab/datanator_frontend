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
    filterChangedCallback: PropTypes.func.isRequired
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
      maxDistance: null
    };

    this.markValueToDistance = null;
    this.rankNameToDistance = null;

    this.onChange = this.onChange.bind(this);
  }

  isFilterActive() {
    return this.maxDistance < this.markValueToDistance.length - 1;
  }

  componentDidMount() {
    this.locationPathname = history.location.pathname;
    this.unlistenToHistory = history.listen(location => {
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
    getDataFromApi(["taxon", "canon_rank_distance_by_name/?name=" + organism], {
      cancelToken: this.cancelTokenSource.token
    })
      .then(response => {
        this.taxonLineage = response.data;
        this.setMarks();
      })
      .catch(
        genApiErrorHandler(
          ["taxon", "canon_rank_distance_by_name/?name=" + organism],
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
      const distance = Object.values(lineage[iLineage])[0];
      marks.push({
        value: iLineage,
        label: upperCaseFirstLetter(taxon)
      });
      markValueToDistance.push(distance);
    }

    const rankNameToDistance = {};
    if (lineage[1]["rank"] === "species") {
      rankNameToDistance["strain"] = 0;
    } else if (lineage[1]["rank"] === "genus") {
      rankNameToDistance["species"] = 0;
    }
    for (let iLineage = 1; iLineage < lineage.length - 1; iLineage++) {
      const rank = lineage[iLineage]["rank"];
      rankNameToDistance[rank] = iLineage;
    }
    rankNameToDistance["cellular life"] = Object.keys(
      rankNameToDistance
    ).length;
    console.log(rankNameToDistance);

    this.selectedMarkValue = Math.max(marks.length - 1);
    this.maxDistance = markValueToDistance[this.selectedMarkValue];
    this.markValueToDistance = markValueToDistance;
    this.rankNameToDistance = rankNameToDistance;

    this.setState({
      marks: marks,
      selectedMarkValue: this.selectedMarkValue,
      maxDistance: this.maxDistance
    });
  }

  doesFilterPass(params) {
    const maxDistance = this.maxDistance;
    const distance = this.rankNameToDistance[
      this.props.valueGetter(params.node)
    ];
    return distance <= maxDistance;
  }


  getModel() {
    return {
      markValueToDistance: this.markValueToDistance,
      rankNameToDistance: this.rankNameToDistance,
      selectedMarkValue: this.selectedMarkValue
    };
  }

  setModel(model) {
    if (model && "markValueToDistance" in model) {
      this.markValueToDistance = model.markValueToDistance;
      this.rankNameToDistance = model.rankNameToDistance;
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
