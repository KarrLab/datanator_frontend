import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export class LinkCellRenderer extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    colDef: PropTypes.shape({
      cellRendererParams: PropTypes.shape({
        route: PropTypes.string.isRequired,
        organism: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    let url = "/" + this.props.colDef.cellRendererParams.route + "/";

    const query = this.props.value;
    url += query + "/";

    const organism = this.props.colDef.cellRendererParams.organism;
    if (organism) {
      url += organism + "/";
    }

    return <Link to={url}>{query}</Link>;
  }
}
