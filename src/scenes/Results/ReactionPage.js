// App.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { PropTypes } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';


import { getSearchData } from '~/services/MongoApi';
import {
  set_lineage,
  setTotalData,
  setSelectedData,
} from '~/data/actions/resultsAction';import { ReactionDefinition } from '~/components/Definitions/ReactionDefinition';

import { Header } from '~/components/Header/Header';
import { Footer } from '~/components/Footer/Footer';

import { AgGridReact } from 'ag-grid-react';
import { AllModules } from 'ag-grid-enterprise';
import CustomToolPanelReaction from '~/scenes/Results/CustomToolPanelReaction.js';
import { AllCommunityModules } from "@ag-grid-community/all-modules";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import {TaxonomyFilter} from '~/scenes/Results/TaxonomyFilter.js'
import {TanimotoFilter} from '~/scenes/Results/TanimotoFilter.js'
import PartialMatchFilter from "./PartialMatchFilter.js";


import './ag_styles.scss'
import './MetabConcs.scss'


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
      id: 'customStats',
      labelDefault: 'Consensus',
      labelKey: 'customStats',
      iconKey: 'customstats',
      toolPanel: 'CustomToolPanelReaction',
    },
  ],
  position: 'left',
  defaultToolPanel: 'filters',
};

function getReactionID(resource) {
  for (var i = 0; i < resource.length; i++)
    if (resource[i].namespace == 'sabiork.reaction') {
      return resource[i].id;
    }
}

function getSubstrates(substrate) {
  let subNames = [];
  for (var i = 0; i < substrate.length; i++) {
    subNames.push(substrate[i].substrate_name);
  }
  return subNames;
}

function getProducts(product) {
  let subNames = [];
  for (var i = 0; i < product.length; i++) {
    subNames.push(product[i].product_name);
  }
  return subNames;
}

function formatPart(parts) {
  let participants_string = '';
  for (var i = parts.length - 1; i >= 0; i--) {
    participants_string = participants_string + parts[i] + ' + ';
  }
  participants_string = participants_string.substring(
    0,
    participants_string.length - 3,
  );
  return participants_string;
}

function getSubstrateInchiKey(substrate) {
  let inchiKeys = [];
  for (var i = 0; i < substrate.length; i++) {
    if (substrate[i].substrate_structure[0]){
      inchiKeys.push(substrate[i].substrate_structure[0].InChI_Key);
    }
  }
  return inchiKeys;
}

function getProductInchiKey(product) {
  let inchiKeys = [];
  for (var i = 0; i < product.length; i++) {
    if (product[i].product_structure[0]){
      inchiKeys.push(product[i].product_structure[0].InChI_Key);
    }
  }
  return inchiKeys;
}

function getKcat(parameters) {
  let kinetic_params = {};
  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].name == 'k_cat'){
      kinetic_params["kcat"] = parameters[i].value
    }
  }
  return kinetic_params;
}

function getKm(parameters, substrates) {
  let kms = {};
  for (var i = 0; i < parameters.length; i++) {
    if (parameters[i].type == '27' && substrates.includes(parameters[i]['name']) && parameters[i]['observed_name'].toLowerCase() == "km"){
      kms["km_" + parameters[i]['name']] = parameters[i].value
    }
  }
  return kms;
}
/*
reaction_id
kcat
wildtype_mutant
organism
ph
temperature

*/
@connect(store => {
  return {totalData: store.results.totalData,};
}) //the names given here will be the names of props
class ReactionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reactionMetadata: [],
      km_values:[],
      modules: AllCommunityModules,
      lineage:[],
      dataSource: [],
      data_arrived: false,
      newSearch: false,
      new_url: '',
      tanimoto: false,
      columnDefs:[],
      first_columns: [
        {
          headerName: 'Entry ID',
          field: 'kinlaw_id',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          //filter: 'taxonomyFilter',
          filter: "agNumberColumnFilter",
          menuTabs: ["filterMenuTab"]
        },
        {
          headerName: 'Kcat',
          field: 'kcat',
          sortable: true,
          filter: 'agNumberColumnFilter',
        },
      ],
      second_columns: [{
          headerName: 'Organism',
          field: 'organism',
          filter: 'agTextColumnFilter',
        },
        {
          headerName: 'Source Link',
          field: 'source_link',

          cellRenderer: function(params) {
            console.log(params);
            if (true) {
              return (
                '<a href="http://sabio.h-its.org/reacdetails.jsp?reactid=' +
                params.value.reactionID +
                '"rel="noopener">' +
                'SABIO-RK' +
                '</a>'
              );
            }
          },
        },


        {
          headerName: 'Taxonomic Distance',
          field: 'taxonomic_proximity',
          hide: true,
          filter: 'taxonomyFilter',
        },
        {
          headerName: 'Tanimoto Similarity',
          field: 'tanimoto_similarity',
          hide: true,
          filter: 'tanimotoFilter',
        },
        {
          headerName: 'Growth Phase',
          field: 'growth_phase',
          filter: 'agTextColumnFilter',
          hide: true,
        },
        {
          headerName: 'Conditions',
          field: 'growth_conditions',
          filter: 'agTextColumnFilter',
          hide: true,
        },
        {
          headerName: 'Media',
          field: 'growth_media',
          filter: 'agTextColumnFilter',
          hide: true,
        },
      ],

      rowData: null,
      rowSelection: 'multiple',
      autoGroupColumnDef: {
        headerName: 'Conc',
        field: 'concentration',
        width: 200,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: { checkbox: true },
      },
       frameworkComponents: { CustomToolPanelReaction: (() => <CustomToolPanelReaction relevant_column={"kcat"} />), taxonomyFilter: TaxonomyFilter, partialMatchFilter: PartialMatchFilter, 
        tanimotoFilter: TanimotoFilter }
    };

    this.formatReactionData = this.formatReactionData.bind(this);
    this.getSearchDataReaction = this.getSearchDataReaction.bind(this);
    this.getNewSearch = this.getNewSearch.bind(this);
    this.setKmColumns = this.setKmColumns.bind(this);

  }

  setKmColumns(km_values){
    let new_columns = []
    for (var i = km_values.length - 1; i >= 0; i--) {
      new_columns.push({
          headerName: 'Km ' + km_values[i].split("_")[1] + ' (M)',
          field: km_values[i],
          sortable: true,
          filter: 'agNumberColumnFilter',
        })
    }

    let final_columns = this.state.first_columns.concat(new_columns).concat(this.state.second_columns)
    //final_columns = final_columns.concat(default_second_columns)
    this.setState({columnDefs:final_columns})

  }
  componentDidMount() {
    console.log("ReactionPage: Calling componentDidMount")
    this.setState({
      newSearch: false,
    });
    if (this.props.match.params.dataType == 'meta') {
      this.getMetaData();
    }

    if (this.props.match.params.dataType == 'data') {
      this.getResultsData();
    }
  }

  componentDidUpdate(prevProps) {
    console.log('ReactionPage: Calling componentDidUpdate')
    let values = queryString.parse(this.props.location.search);
    let old_values = queryString.parse(prevProps.location.search);
    //console.log('Here yo: ');
    //console.log(values);
    //console.log(values.substrates)
    //console.log(old_values.substrates)
    if (
      values.substrates != old_values.substrates ||
      values.products != old_values.products ||
      this.props.match.params.dataType != prevProps.match.params.dataType
    ) {
      console.log("blue")
      console.log("Substrate values: " + values.substrates != old_values.substrates)
      console.log("Substrate values: "+ (values.substrates != old_values.substrates))
      console.log(values.substrates)
      console.log(old_values.substrates)
      console.log("Redirect value: "+ this.state.redirect)
      this.setState({
      dataSource: [],
      data_arrived: false,
      newSearch: false,
      new_url: '',
      reactionMetadata: [],
      km_values:[],
    })
    //console.log("RE-UP")
      if (this.props.match.params.dataType == 'meta') {
        this.setState({ newSearch: false });
        this.getMetaData();
      }
      if (this.props.match.params.dataType == 'data') {
        this.setState({ newSearch: false });
        this.getResultsData();
      }
    }
  }

  getMetaData() {
    console.log('ReactionPage: Calling getMetaData');
    let values = queryString.parse(this.props.location.search)
    getSearchData([
      'reactions/kinlaw_by_name/?products=' + values.products + '&substrates='+ values.substrates + '&_from=0&size=1000&bound=tight',
    ])
      .then(response => {
        this.formatReactionMetadata(response.data);
      })
      .catch(err => {
        //alert('Nothing Found');
        this.setState({ orig_json: null });
      });
  }

  getResultsData() {
    console.log('ReactionPage: Calling getResultsData');
    let values = queryString.parse(this.props.location.search);

    getSearchData([
      'reactions/kinlaw_by_name/?products=' +
        values.products_inchi +
        '&substrates=' +
        values.substrates_inchi +
        '&_from=0&size=1000&bound=tight',
    ])
      .then(response => {
        this.formatReactionMetadata(response.data);
        this.formatReactionData(response.data);
      })
      //.catch(err => {
        //alert('Nothing Found');
        //this.setState({ orig_json: null });
      //});
  }

  formatReactionData(data) {
    console.log('ReactionPage: Calling formatReactionData');
    if (data != null) {
      var total_rows = [];
      let substrates = getSubstrates(data[0].reaction_participant[0].substrate);
      let km_values = []
      for (var k = substrates.length - 1; k >= 0; k--) {
        km_values.push("km_" + substrates[k])
      }
      this.setKmColumns(km_values)
      this.setState({km_values:km_values})

      let start = 0;
      for (var i = start; i < data.length; i++) {
        let wildtype_mutant = null
        if (data[i]['taxon_wildtype'] == '1'){
          wildtype_mutant = "wildtype"
        }
        else if (data[i]['taxon_wildtype'] == '0'){
          wildtype_mutant = "mutant"
        }
        let row = {
          kinlaw_id: data[i]['kinlaw_id'],
          kcat: getKcat(data[i].parameter)["kcat"],
          wildtype_mutant:wildtype_mutant,
          organism: data[i].taxon_name,
          ph: data[i].ph,
          temperature: data[i].temperature,
          source_link:{ reactionID: getReactionID(data[i].resource)},
        }
        let row_with_km = Object.assign({}, row, getKm(data[i].parameter, substrates))
        //console.log(row_with_km)
        total_rows.push(row_with_km)
      }

      this.props.dispatch(setTotalData(total_rows));
      this.setState({
        data_arrived: true,
      });
    } else {
    }
  }

  getSearchDataReaction(url) {
    console.log('ReactionPage: Calling getSearchDataReaction');
    console.log('ReactionPageLoc: ' + ( '/reaction' + window.location.toString().split('/reaction')[1]))
    console.log('ReactionPageLoc: ' + url)
    if (url != ( '/reaction' + window.location.toString().split('/reaction')[1])){
      this.setState({ new_url: url});
    //console.log(url);
    this.setState({ newSearch: true });
    }
  }
  getNewSearch(response) {
    let url = '/general/?q=' + response[0] + '&organism=' + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }

  formatReactionMetadata(data) {
    console.log('ReactionPage: Calling formatReactionMetadata');
    let newReactionMetadataDict = {};
    let start = 0;
    for (var i = start; i < data.length; i++) {
      let reactionID = getReactionID(data[i].resource);
      let new_dict = newReactionMetadataDict[reactionID];
      if (!new_dict) {
        new_dict = {};
      }
      let substrates = getSubstrates(data[i].reaction_participant[0].substrate);
      let products = getProducts(data[i].reaction_participant[1].product);
      new_dict['reactionID'] = reactionID;
      new_dict['substrates'] = substrates;
      new_dict['products'] = products;

      let sub_inchis = getSubstrateInchiKey(
        data[i].reaction_participant[0].substrate,
      );
      let prod_inchis = getProductInchiKey(
        data[i].reaction_participant[1].product,
      );

      new_dict['equation'] = [
        formatPart(substrates) + ' ==> ' + formatPart(products),
        { sub_inchis: sub_inchis, prod_inchis: prod_inchis },
      ];
      newReactionMetadataDict[reactionID] = new_dict;
      console.log(new_dict);
      //newReactionMetadataDict.push(meta);
    }

    this.setState({
      reactionMetadata: Object.keys(newReactionMetadataDict).map(function(key) {
        return newReactionMetadataDict[key];
      }),
    });
  }

  onFirstDataRendered(params) {
    //params.columnApi.autoSizeColumns(['concentration'])

    var allColumnIds = [];
    params.columnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    params.columnApi.autoSizeColumns(allColumnIds);
    //params.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  onRowSelected(event) {
    //window.alert("row " + event.node.data.athlete + " selected = " + event.node.selected);
    console.log('eyooo');
    console.log(event.api.getSelectedNodes());
    let selectedRows = [];
    for (var i = event.api.getSelectedNodes().length - 1; i >= 0; i--) {
      selectedRows.push(event.api.getSelectedNodes()[i].data);
    }
    this.props.dispatch(setSelectedData(selectedRows));
  }

  onFiltered(event) {
    //window.alert("row " + event.node.data.athlete + " selected = " + event.node.selected);
    console.log('eyooo');
    event.api.deselectAll()
    this.props.dispatch(setSelectedData([]));
  }


  

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

  };



  onClicked() {
    console.log(this)
    this.gridApi
      .getFilterInstance("taxonomic_proximity")
      .getFrameworkComponentInstance()
      .componentMethod2("Hello World!");
  }

  render() {
    console.log('ReactionPage: Rendering ReactionPage');
    console.log(this.state.reactionMetadata)
    const values = queryString.parse(this.props.location.search);
    //console.log(values.substrates.split(',')[0]);

    if (this.state.newSearch == true) {
      console.log('Redirecting');
      return <Redirect to={this.state.new_url} push />;
    }

    if (this.props.totalData == null ){
        return ( <div>

          <Header 
        handleClick={this.getNewSearch}
        defaultQuery={values.q}
        defaultOrganism={values.organism}
      />
      <div class="loader_container">
      <div class="loader"></div> 
      </div>
      </div>)
      }



    let styles = {
      marginTop: 50,
    };

    return (
      <div className="total_container">
        
      <Header 
        handleClick={this.getNewSearch}
        defaultQuery={values.q}
        defaultOrganism={values.organism}
      />

      <div
        className="metabolite_definition_data"
      ></div>







        <div
          className="ag_chart"
          style={{width: '100%', height:"1000px" }}
          
        >
          <div
            className="ag-theme-balham"
            style={{width: '100%', height:"100%"}}
          >

            <AgGridReact
            modules={this.state.modules}
            frameworkComponents={this.state.frameworkComponents}
              columnDefs={this.state.columnDefs}
              sideBar={sideBar}
              
              rowData={this.props.totalData}
              gridOptions={{ floatingFilter: true }}
              onFirstDataRendered={this.onFirstDataRendered.bind(this)}
              rowSelection={this.state.rowSelection}
              groupSelectsChildren={true}
              suppressRowClickSelection={true}
              //autoGroupColumnDef={this.state.autoGroupColumnDef}
              //onGridReady={this.onGridReady}
              lineage={this.state.lineage}
              onSelectionChanged={this.onRowSelected.bind(this)}
              onFilterChanged = {this.onFiltered.bind(this)}
              domLayout={'autoHeight'}
               domLayout={'autoWidth'}
              onGridReady={this.onGridReady}
            ></AgGridReact>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(ReactionPage);
