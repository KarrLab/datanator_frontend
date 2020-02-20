import React, { Component } from "react";
import PropTypes from "prop-types";

import "./ColumnsToolPanel.scss";

class ColumnsToolPanel extends Component {
  static propTypes = {
    /* AG-Grid API */
    api: PropTypes.shape({
      addEventListener: PropTypes.func.isRequired,
      removeEventListener: PropTypes.func.isRequired
    }).isRequired,
    agGridReact: PropTypes.shape({
      columnApi: PropTypes.shape({
        setColumnVisible: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      cols: []
    };

    this.updateCols = this.updateCols.bind(this);
  }

  /**
   * When mounted, setup listeners to update columns
   */
  componentDidMount() {
    this.updateCols(this.props.agGridReact);
    this.props.api.addEventListener("columnVisible", this.updateCols);
    this.props.api.addEventListener("newColumnsLoaded", this.updateCols);
    this.props.api.addEventListener("gridColumnsChanged", this.updateCols);
    this.props.api.addEventListener("displayedColumnsChanged", this.updateCols);
  }

  /**
   * When component updates, update listeners to update columns
   */
  componentDidUpdate(prevProps) {
    /* istanbul ignore next */
    /* Never reached because the application never changes the 'api' property */
    if (prevProps.api !== this.props.api) {
      prevProps.api.removeEventListener("columnVisible", this.updateCols);
      prevProps.api.removeEventListener("newColumnsLoaded", this.updateCols);
      prevProps.api.removeEventListener("gridColumnsChanged", this.updateCols);
      prevProps.api.removeEventListener(
        "displayedColumnsChanged",
        this.updateCols
      );

      this.updateCols(this.props.agGridReact);
      this.props.api.addEventListener("columnVisible", this.updateCols);
      this.props.api.addEventListener("newColumnsLoaded", this.updateCols);
      this.props.api.addEventListener("gridColumnsChanged", this.updateCols);
      this.props.api.addEventListener(
        "displayedColumnsChanged",
        this.updateCols
      );
    }
  }

  updateCols(event) {
    const cols = [];
    for (const colApi of event.columnApi.getAllGridColumns()) {
      const col = {
        index: cols.length,
        id: colApi.colId,
        name: null,
        visible: colApi.visible
      };

      const colDef = colApi.colDef;
      if ("headerComponentFramework" in colDef) {
        col.name = colDef.headerComponentParams.name;
      } else {
        col.name = colDef.headerName;
      }

      cols.push(col);
    }

    this.setState({
      cols: cols
    });
  }

  toggleCol(col, event) {
    this.props.agGridReact.columnApi.setColumnVisible(
      col.id,
      event.target.checked
    );
  }

  render() {
    return (
      <ul className="biochemical-entity-scene-columns-tool-panel">
        {this.state.cols.map(col => {
          return (
            <li key={col.id}>
              <input
                type="checkbox"
                checked={col.visible}
                onChange={this.toggleCol.bind(this, col)}
              />{" "}
              {col.name}
            </li>
          );
        })}
      </ul>
    );
  }
}

export { ColumnsToolPanel };
