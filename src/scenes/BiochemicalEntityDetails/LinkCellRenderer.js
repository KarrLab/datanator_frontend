import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export class LinkCellRenderer extends Component {
  static propTypes = {
    value: PropTypes.shape({
      query: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }),
    colDef: PropTypes.shape({
      cellRendererParams: PropTypes.shape({
        route: PropTypes.string.isRequired,
        organism: PropTypes.string
      }).isRequired
    }).isRequired
  };

  render() {
    let url = "/" + this.props.colDef.cellRendererParams.route + "/";

    url += this.props.value.query + "/";

    const organism = this.props.colDef.cellRendererParams.organism;
    if (organism != null && organism !== undefined) {
      url += organism + "/";
    }

    return (
      <Link className="ag-cell-link" to={url}>
        {this.props.value.label}
      </Link>
    );
  }
}
