import React, { Component } from "react";
import PropTypes from "prop-types";

class HtmlColumnHeader extends Component {
  static propTypes = {
    column: PropTypes.shape({
      colDef: PropTypes.shape({
        headerComponentParams: PropTypes.shape({
          name: PropTypes.object.isRequired
        }).isRequired
      }).isRequired
    }).isRequired,
    setSort: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      sort: "none"
    };

    this.toggleSort = this.toggleSort.bind(this);
  }

  render() {
    return (
      <div
        className={
          "ag-cell-label-container ag-header-cell-sorted-" + this.state.sort
        }
        role="presentation"
      >
        <div
          className="ag-header-cell-label"
          role="presentation"
          onClick={this.toggleSort}
          onTouchEnd={this.toggleSort}
        >
          <div className="ag-header-cell-text">
            {this.props.column.colDef.headerComponentParams.name}
          </div>
          <div>
            <span
              className={
                "ag-header-icon ag-sort-ascending-icon" +
                (this.state.sort === "asc" ? "" : " ag-hidden")
              }
              role="columnheader"
            >
              <span className="ag-icon ag-icon-asc" aria-hidden="true"></span>
            </span>
            <span
              className={
                "ag-header-icon ag-sort-descending-icon" +
                (this.state.sort === "desc" ? "" : " ag-hidden")
              }
            >
              <span className="ag-icon ag-icon-desc" aria-hidden="true"></span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  toggleSort(event) {
    let sort;
    if (this.state.sort === "none") {
      sort = "asc";
    } else if (this.state.sort === "asc") {
      sort = "desc";
    } else {
      sort = "none";
    }
    this.setState({ sort: sort });
    this.props.setSort(sort, event.shiftKey);
  }
}

export { HtmlColumnHeader };
