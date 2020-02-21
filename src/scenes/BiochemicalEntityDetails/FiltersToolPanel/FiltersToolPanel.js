import React, { Component } from "react";
import PropTypes from "prop-types";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import "./FiltersToolPanel.scss";

class FiltersToolPanel extends Component {
  static propTypes = {
    /* AG-Grid API */
    api: PropTypes.shape({
      addEventListener: PropTypes.func.isRequired,
      removeEventListener: PropTypes.func.isRequired,
      setFilterModel: PropTypes.func.isRequired
    }).isRequired,
    agGridReact: PropTypes.shape({
      gridOptions: PropTypes.shape({
        frameworkComponents: PropTypes.object.isRequired
      }).isRequired,
      columnApi: PropTypes.shape({
        setColumnVisible: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.filterRefs = {};
    this.state = {
      filters: []
    };

    this.updateFilters = this.updateFilters.bind(this);
  }

  /**
   * When mounted, setup listeners to update filters
   */
  componentDidMount() {
    this.updateFilters(this.props.agGridReact);
    this.props.api.addEventListener("gridReady", this.updateFilters);
    this.props.api.addEventListener("newColumnsLoaded", this.updateFilters);
    this.props.api.addEventListener("gridColumnsChanged", this.updateFilters);
  }

  /**
   * When component updates, update listeners to update filters
   */
  componentDidUpdate(prevProps) {
    /* istanbul ignore next */
    /* Never reached because the application never changes the 'api' property */
    if (prevProps.api !== this.props.api) {
      prevProps.api.removeEventListener("gridReady", this.updateFilters);
      prevProps.api.removeEventListener("newColumnsLoaded", this.updateFilters);
      prevProps.api.removeEventListener(
        "gridColumnsChanged",
        this.updateFilters
      );

      this.updateFilters(this.props.agGridReact);
      this.props.api.addEventListener("gridReady", this.updateFilters);
      this.props.api.addEventListener("newColumnsLoaded", this.updateFilters);
      this.props.api.addEventListener("gridColumnsChanged", this.updateFilters);
    }
  }

  updateFilters(event) {
    const filters = [];
    for (const colApi of event.columnApi.getAllGridColumns()) {
      const colDef = colApi.colDef;

      if (colDef.suppressFiltersToolPanel) {
        continue;
      }
      const filter = {
        colId: colApi.colId,
        name: null,
        colDef: colApi.colDef,
        filterValueGetter: colApi.colDef.filterValueGetter,
        valueGetter: colApi.colDef.valueGetter
      };

      if (filter.filterValueGetter === undefined) {
        filter.filterValueGetter = null;
      }

      if (filter.valueGetter === undefined) {
        filter.valueGetter = ((fields, node) => {
          let data = node.data;
          for (const field of fields) {
            data = data[field];
          }
          return data;
        }).bind(null, colDef.field.split("."));
      }

      if ("headerComponentFramework" in colDef) {
        filter.name = colDef.headerComponentParams.name;
      } else {
        filter.name = colDef.headerName;
      }

      filters.push(filter);
    }

    this.setState({
      filters: filters
    });
  }

  applyFilter(colId) {
    this.props.api.setFilterModel({
      [colId]: this.filterRefs[colId].current.getModel()
    });
  }

  render() {
    const filterTypes = this.props.agGridReact.gridOptions.frameworkComponents;
    return (
      <div className="biochemical-entity-scene-filters-tool-panel">
        {this.state.filters.map(filter => {
          const FilterType = filterTypes[filter.colDef.filter];
          this.filterRefs[filter.colId] = React.createRef();
          return (
            <ExpansionPanel key={filter.colId} square={true}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                {filter.name}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <FilterType
                  ref={this.filterRefs[filter.colId]}
                  api={this.props.api}
                  agGridReact={this.props.agGridReact}
                  colDef={filter.colDef}
                  filterValueGetter={filter.filterValueGetter}
                  valueGetter={filter.valueGetter}
                  filterChangedCallback={this.applyFilter.bind(
                    this,
                    filter.colId
                  )}
                  {...filter.colDef.filterParams}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    );
  }
}

export { FiltersToolPanel };
