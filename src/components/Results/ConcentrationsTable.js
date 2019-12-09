import React, { Component } from 'react';
//import 'antd/dist/antd.css';
import { withRouter } from 'react-router';
//import './ConcentrationsTable.css';
import { ResultsTable } from './components/ResultsTable.js';
import { TaxonFilter } from '~/components/Results/components/Filters/TaxonFilter';
import { TanitomoFilter } from '~/components/Results/components/Filters/TanitomoFilter';
import { Consensus } from './components/Consensus.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ResultsPageTemplate } from '~/components/Results/ResultsPageTemplate';
import { AgGridReact } from 'ag-grid-react';
import { AllModules } from "ag-grid-enterprise";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const sideBar = {
    toolPanels: [{
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
        }
    }]
}

@connect(store => {
  return {
    columns: store.results.columns,
  };
})

/**
 * Class putting together the components of Results to construct the 
 * correct table for metabolite concentrations
 */
class ConcentrationsTable extends Component {
  static propTypes = {
    /**
     * Value to keep track of whether the JSON data has arrived
     * If this value is false, then the render should return a blank div 
     */
    data_arrived: PropTypes.bool.isRequired,

    /**
     * Value to keep track of whether the tanitomo column should be displayed
     */
    tanitomo: PropTypes.bool.isRequired,


  };
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "Molecule", field: "name", checkboxSelection: true, filter: "agTextColumnFilter" },
        { headerName: "Conc.", field: "concentration", sortable: true, filter: "agNumberColumnFilter" },
        { headerName: "Error", field: "error" },
        { headerName: "Organism", field: "organism" },
        { headerName: "Taxonomic Distance", field: "taxonomic_proximity" },
        { headerName: "Growth Phase", field: "growth_phase" },
        { headerName: "Conditions", field: "growth_conditions" },
        { headerName: "Media", field: "growth_media" }],
    }
  }


  render() {
    console.log('Rendering ConcentrationsTable');

    if (!this.props.data_arrived) {
      return <div><p>Nothing Found. Either our database has no data, or we have it recoreded under a different name</p></div>;
    } else {
      return (
        <div >
          <ResultsPageTemplate
              filters = {[
                <TaxonFilter />,
                <TanitomoFilter tanitomo={this.props.tanitomo} />
                ]}
              table = {<AgGridReact
            columnDefs={this.state.columnDefs}
            sideBar = {true}
            rowData={this.props.totalData}
            gridOptions = {{floatingFilter:true}}
            >
        </AgGridReact>}
              relevantColumns = {['concentration']}
          />
        </div>
      );
    }
  }
}

export default withRouter(ConcentrationsTable);

