// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Input,
} from 'antd';
//import 'antd/dist/antd.css';
import ConcentrationsTable from '~/components/Results/ConcentrationsTable.js';
import ConcSearch from '~/components/SearchField/ConcSearch.js';
import { PropTypes } from 'react';
import {Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import GeneralSearch from '~/components/SearchField/GeneralSearch.js';
import { Consensus } from '~/components/Results/components/Consensus.js';


import { getSearchData } from '~/services/MongoApi';
import { abstractMolecule } from '~/data/actions/pageAction';
import {
  set_lineage,
  setTotalData,
  setSelectedData,
} from '~/data/actions/resultsAction';

import {Header} from '~/components/Layout/Header/Header';
import {Footer} from '~/components/Layout/Footer/Footer';

import { AgGridReact } from 'ag-grid-react';
import { AllModules } from "ag-grid-enterprise";
import AGGrid from '~/scenes/Results/AGGrid';
import CustomToolPanel from "~/scenes/Results/CustomToolPanel.js";


import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const queryString = require('query-string');
const sideBar = {
    toolPanels: [
        {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
        },
        {
            id: 'filters',
            labelDefault: 'Filters',
            labelKey: 'filters',
            iconKey: 'filter',
            toolPanel: 'agFiltersToolPanel',
        },
          {
            id: "customStats",
            labelDefault: "Custom Stats",
            labelKey: "customStats",
            iconKey: "custom-stats",
            toolPanel: "CustomToolPanel"
          }
    ],
    position: 'left',
    defaultToolPanel: 'customStats',
}

@connect(store => {
  return {
    moleculeAbstract: store.page.moleculeAbstract,
    totalData: store.results.totalData,
  };
}) //the names given here will be the names of props
class MetabConcs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      data_arrived: false,
      newSearch: false,
      new_url: '',
      tanitomo: false,
      columnDefs: [
        { headerName: "Molecule", field: "name", checkboxSelection: true, headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true, filter: "agTextColumnFilter" },
        { headerName: "Conc.", field: "concentration", sortable: true, filter: "agNumberColumnFilter" },
        { headerName: "Error", field: "error", hide:true },
        { headerName: "Organism", field: "organism", filter: "agTextColumnFilter" },
        { headerName: "Taxonomic Distance", field: "taxonomic_proximity", hide:true},
        { headerName: "Growth Phase", field: "growth_phase", filter: "agTextColumnFilter",hide:true },
        { headerName: "Conditions", field: "growth_conditions", filter: "agTextColumnFilter",hide:true },
        { headerName: "Media", field: "growth_media", filter: "agTextColumnFilter",hide:true }],


        rowData: null,
      rowSelection: "multiple",
      autoGroupColumnDef: {
        headerName: "Conc",
        field: "concentration",
        width: 200,
        cellRenderer: "agGroupCellRenderer",
        cellRendererParams: { checkbox: true }
      }
    };

    this.getNewSearch = this.getNewSearch.bind(this);
    this.formatData = this.formatData.bind(this);
    this.onFirstDataRendered = this.onFirstDataRendered.bind(this);
  }
  componentDidMount() {
    this.setState({
      newSearch: false,
    });
    this.getSearchData();
  }

  componentDidUpdate(prevProps) {
    if (!(this.props.match.params.abstract == 'true')) {
      if (this.props.moleculeAbstract == true) {
        this.props.dispatch(abstractMolecule(false));
        let url = '/metabconcs/' + this.props.match.params.molecule + '/' + this.props.match.params.organism +"/"+ "true";
        this.setState({ new_url: url });
        this.setState({ newSearch: true });
      }
    }

    if (
      this.props.match.params.molecule != prevProps.match.params.molecule ||
      this.props.match.params.organism != prevProps.match.params.organism ||
      this.props.match.params.abstract != prevProps.match.params.abstract
    ) {
      this.setState({ newSearch: false });
      this.getSearchData();
    }
  }

  getSearchData() {
    let abs_default = false;
    if (this.props.match.params.abstract == 'true') {
      abs_default = true;
    }
    getSearchData([
      'metabolites/concentration/?abstract=' +
        abs_default +
        '&species=' +
        this.props.match.params.organism +
        '&metabolite=' +
        this.props.match.params.molecule,
    ])
      .then(response => {
        this.formatData(response.data);
      })
      .catch(err => {
        //alert('Nothing Found');
        this.setState({ orig_json: null });
      });
  }


  formatData(data) {
    if (data != null) {
      var f_concentrations = [];

      //this.props.dispatch(set_lineage(data[2][0]));
      getSearchData([
          'taxon',
          'canon_rank_distance_by_name/?name=' + this.props.match.params.organism
        ]).then(

        response => {
          this.props.dispatch(set_lineage(response.data))
        });


      let tani = false
      for (var n = data[0].length; n > 0; n--) {
        if (data[0][n - 1].tanitomo_similarity < 1) {
          this.setState({ tanitomo: true });
          tani = true       
        } else {
          this.setState({ tanitomo: false });
          //this.props.dispatch(abstractMolecule(false))
        }


        var concs = data[0][n - 1].concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (var key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (concs.hasOwnProperty(key)) {
                concs[key] = [concs[key]];
              }
            }
          }
          for (var i = concs.concentration.length - 1; i >= 0; i--) {
            var growth_phase = '';
            var organism = 'Escherichia coli';

            if (concs.growth_status[i] != null) {
              if (
                concs.growth_status[i].toLowerCase().indexOf('stationary') >= 0
              ) {
                growth_phase = 'Stationary Phase';
              } else if (
                concs.growth_status[i].toLowerCase().indexOf('log') >= 0
              ) {
                growth_phase = 'Log Phase';
              }
            }
            if ('strain' in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + ' ' + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: data[0][n - 1].name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_conditions: concs.growth_system[i],
              growth_media: concs.growth_media[i],
              taxonomic_proximity: data[0][n - 1].taxon_distance,
              tanitomo_similarity: data[0][n - 1].tanitomo_similarity,
            });
          }
        }
      }

      for (var n = data[1].length; n > 0; n--) {
        if (data[1][n - 1].tanitomo_similarity < 1) {
          this.setState({ tanitomo: true });
          tani=true
        }

        var concs = data[1][n - 1].concentrations;
        if (concs != null) {
          if (!Array.isArray(concs.concentration)) {
            for (var key in concs) {
              // check if the property/key is defined in the object itself, not in parent
              if (concs.hasOwnProperty(key)) {
                concs[key] = [concs[key]];
              }
            }
          }
          for (var i = concs.concentration.length - 1; i >= 0; i--) {
            var growth_phase = '';
            var organism = data[1][n - 1].species;
            if ('strain' in concs) {
              if (concs.strain != null) {
                if (concs.strain[i] != null) {
                  organism = organism + ' ' + concs.strain[i];
                }
              }
            }

            f_concentrations.push({
              name: data[1][n - 1].name,
              concentration: parseFloat(concs.concentration[i]),
              units: concs.concentration_units[i],
              error: concs.error[i],
              growth_phase: growth_phase,
              organism: organism,
              growth_media: concs.growth_media[i],
              taxonomic_proximity: data[1][n - 1].taxon_distance,
              tanitomo_similarity: data[1][n - 1].tanitomo_similarity,
            });
          }
        }
      }
      if (tani){
        //this.props.dispatch(abstractMolecule(true))
        this.setState({"tanitomo":true})
      }
      else{
        //this.props.dispatch(abstractMolecule(false))
        this.setState({"tanitomo":false})
      }

      this.props.dispatch(setTotalData(f_concentrations));
      this.setState({
        data_arrived: true,
        //displayed_data: f_concentrations
      });
    } else {
      //alert('Nothing Found');
    }
  }

  getNewSearch(response) {
    let url = '/general/?q=' + response[0] + '&organism=' + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }



  onFirstDataRendered(params) {
    //params.columnApi.autoSizeColumns(['concentration'])

    var allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds)
    //params.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  onRowSelected(event) {
    //window.alert("row " + event.node.data.athlete + " selected = " + event.node.selected);
    console.log("eyooo")
    this.props.dispatch(setSelectedData(event.node.data))
  }

  render() {
    console.log('Rendering MetabConcs');
    if (this.state.newSearch == true) {
      console.log('Redirecting');
      return <Redirect to={this.state.new_url} push />;
    }
    const values = queryString.parse(this.props.location.search);



    return (
      <div className="container2" >
      <Header />
      <div className="container3" style={ {marginTop: 50, 'display':'flex','flex-direction':'row',
  'flex-wrap': 'wrap',
  'flex-flow': 'row wrap',} }>
      <div className="ag-theme-balham" style={ {height: '400px', width: '800px',}}>
       <AgGridReact
            columnDefs={this.state.columnDefs}
            sideBar = {sideBar}
            frameworkComponents={{CustomToolPanel: CustomToolPanel }}
            rowData={this.props.totalData}
            gridOptions = {{floatingFilter:true}}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}

            rowSelection={this.state.rowSelection}
            groupSelectsChildren={true}
            suppressRowClickSelection={true}
            //autoGroupColumnDef={this.state.autoGroupColumnDef}
            onGridReady={this.onGridReady}
            onRowSelected={this.onRowSelected.bind(this)}
            >
        </AgGridReact>
        </div>

        </div>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(MetabConcs);
