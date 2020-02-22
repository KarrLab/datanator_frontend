import React, { Component } from "react";
import PropTypes from "prop-types";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

class ToolPanels extends Component {
  static propTypes = {
    agGridReactRef: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      agGridReact: null,
      panels: []
    };
  }

  componentDidMount() {
    this.updatePanels();
  }

  componentDidUpdate(prevProps) {
    const panels = this.getPanels(this.props);
    const prevPanels = this.getPanels(prevProps);
    if (this.props !== prevProps || panels !== prevPanels) {
      this.updatePanels();
    }
  }

  getPanels(props) {
    const agGridReact = props.agGridReactRef.current;
    if (agGridReact == null) {
      return null;
    }

    const sideBar = agGridReact.gridOptions.sideBar;
    if (sideBar == null) {
      return null;
    }

    return sideBar.toolPanels;
  }

  updatePanels() {
    const agGridReact = this.props.agGridReactRef.current;
    const panelDefs = this.getPanels(this.props) || [];

    const panels = [];
    for (const panelDef of panelDefs) {
      panels.push({
        id: panelDef.id,
        name: panelDef.labelDefault,
        type: agGridReact.gridOptions.frameworkComponents[panelDef.toolPanel],
        params: "toolPanelParams" in panelDef ? panelDef.toolPanelParams : {}
      });
    }

    this.setState({
      agGridReact: agGridReact,
      panels: panels
    });
  }

  render() {
    return (
      <div className="biochemical-entity-data-table-tool-panels">
        {this.state.panels.map(panel => {
          return (
            <ExpansionPanel
              key={panel.id}
              className="biochemical-entity-data-table-tool-panel"
            >
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                {panel.name}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <panel.type
                  api={this.state.agGridReact.api}
                  agGridReact={this.state.agGridReact}
                  {...panel.params}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    );
  }
}

export { ToolPanels };
