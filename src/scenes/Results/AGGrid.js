import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { getSearchData } from '~/services/MongoApi';
import { set_lineage, setTotalData } from '~/data/actions/resultsAction';
import { ReactionDefinition } from '~/components/Definitions/ReactionDefinition';
import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';
import ExampleTable from '~/components/Results/ExampleTable.js';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
const queryString = require('query-string');


const data = [
  { name: 'Trajan', concentration: 98, abundance: 117, gene_symbol: 'dhs'},
  { name: 'Hadrian', concentration: 117, abundance: 138, gene_symbol: 'asa' },
  { name: 'Antoninus ', concentration: 138, abundance: 161, gene_symbol: 'ynd' },
  { name: 'Marcus ', concentration: 161, abundance: 180, gene_symbol: 'erx' },
];


@connect(store => {
  return {
    totalData: store.results.totalData,
  };
})
class AGGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        { headerName: "Molecule", field: "name", checkboxSelection: true },
        { headerName: "Conc.", field: "concentration", sortable: true, filter: true },
        { headerName: "Error", field: "error" },
        { headerName: "Organism", field: "organism" },
        { headerName: "Taxonomic Distance", field: "taxonomic_proximity" },
        { headerName: "Growth Phase", field: "growth_phase" },
        { headerName: "Conditions", field: "growth_conditions" },
        { headerName: "Media", field: "growth_media" }],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }],
      displayed_data: []
    }
  }


  componentDidMount() {
    this.setState({
      newSearch: false,
    });
    this.getSearchData();
  }


  getSearchData() {
    let abs_default = false;
    let values = queryString.parse(this.props.location.search);

    if (values.abstract == 'true') {
      abs_default = true;
    }

    getSearchData([
      'metabolites/concentration/?abstract=' +
        abs_default +
        '&species=' +
        values.organism +
        '&metabolite=' +
        values.molecule,
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
      /*
      getSearchData([
          'taxon',
          'canon_rank_distance_by_name/?name=' + this.props.match.params.organism
        ]).then(

        response => {
          this.props.dispatch(set_lineage(response.data))
        });
      */


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
      console.log(f_concentrations)

      this.props.dispatch(setTotalData(f_concentrations));
      this.setState({
        data_arrived: true,
        displayed_data: f_concentrations
      });
    } else {
      //alert('Nothing Found');
    }
  }


  render() {
    console.log(this.state.displayed_data)
    return (
      <div className="ag-theme-balham" style={ {height: '300px', width: '800px'} }>
        <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.props.totalData}>
        </AgGridReact>
      </div>
    );
  }
}

export default withRouter(AGGrid);
