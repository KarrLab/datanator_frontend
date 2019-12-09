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


import { getSearchData } from '~/services/MongoApi';
import { abstractMolecule } from '~/data/actions/pageAction';
import {
  set_lineage,
  setTotalData,
} from '~/data/actions/resultsAction';

import {Header} from '~/components/Layout/Header/Header';
import {Footer} from '~/components/Layout/Footer/Footer';

import { AgGridReact } from 'ag-grid-react';
import { AllModules } from "ag-grid-enterprise";
import AGGrid from '~/scenes/Results/AGGrid';



import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const queryString = require('query-string');
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
        { headerName: "Molecule", field: "name", checkboxSelection: true, filter: "agTextColumnFilter" },
        { headerName: "Conc.", field: "concentration", sortable: true, filter: "agNumberColumnFilter" },
        { headerName: "Error", field: "error" },
        { headerName: "Organism", field: "organism" },
        { headerName: "Taxonomic Distance", field: "taxonomic_proximity" },
        { headerName: "Growth Phase", field: "growth_phase" },
        { headerName: "Conditions", field: "growth_conditions" },
        { headerName: "Media", field: "growth_media" }],
    };

    this.getNewSearch = this.getNewSearch.bind(this);
    this.formatData = this.formatData.bind(this);
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
      <div className="ag-theme-balham" style={ {height: '300px', width: '800px', marginTop: 50} }>
       <AgGridReact
            columnDefs={this.state.columnDefs}
            sideBar = {true}
            rowData={this.props.totalData}
            gridOptions = {{floatingFilter:true}}
            >
        </AgGridReact>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(MetabConcs);
