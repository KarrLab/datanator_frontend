import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReactDOM from 'react-dom';

import { PropTypes } from 'react';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import { getSearchData } from '~/services/MongoApi';

import {
  set_lineage,
  setTotalData,
  setSelectedData,
} from '~/data/actions/resultsAction';

import { setNewUrl, abstractMolecule } from '~/data/actions/pageAction';
import '~/scenes/Results/ProteinPage.css';
import { Header } from '~/components/Layout/Header/Header';
import { Footer } from '~/components/Layout/Footer/Footer';

import store from '~/data/Store';

import { AgGridReact } from 'ag-grid-react';
import { AllModules } from 'ag-grid-enterprise';
import CustomToolPanel from '~/scenes/Results/CustomToolPanel.js';
import { AllCommunityModules } from "@ag-grid-community/all-modules";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import {TaxonomyFilter} from '~/scenes/Results/TaxonomyFilter.js'
import {TanitomoFilter} from '~/scenes/Results/TanitomoFilter.js'
import PartialMatchFilter from "./PartialMatchFilter.js";
import './ag_styles.css'
import './MetabConcs.css'


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
      toolPanel: 'CustomToolPanel',
    },
  ],
  position: 'left',
  defaultToolPanel: 'filters',
};



Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

@connect(store => {
  return {
    //currentUrl: store.page.url,
    moleculeAbstract: store.page.moleculeAbstract,
    totalData: store.results.totalData,
  };
}) //the names given here will be the names of props
class ProteinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      proteinMetadata: [],
      orthologyMetadata: [],
      f_abundances: null,
      organism: '',
      dataSource: [],
      orig_json: null,
      newSearch: false,
      new_url: '',
      isFlushed: false,
      data_arrived: false,
      modules: AllCommunityModules,
      lineage:[],
      dataSource: [],
      data_arrived: false,
      newSearch: false,
      new_url: '',
      tanitomo: false,
      columnDefs: [
        {
          headerName: 'Protein',
          field: 'protein_name',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          //filter: 'taxonomyFilter',
          filter: "agNumberColumnFilter",
          menuTabs: ["filterMenuTab"]
        },
        {
          headerName: 'Abundance',
          field: 'abundance',
          sortable: true,
          filter: 'agNumberColumnFilter',
        },
        { headerName: 'Error', field: 'error', hide: true },
        {
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
                '<a href="https://pax-db.org/search?q=' +
                params.value.uniprot_id +
                '"rel="noopener">' +
                'PAXdb' +
                '</a>'
              );
            } else {
              return (
                '<a href="http://www.ymdb.ca/compounds/' +
                params.value.id +
                '"rel="noopener">' +
                'YMDB' +
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
          headerName: 'Organ',
          field: 'organ',
          filter: 'agTextColumnFilter',
          hide: true,
        },
        {
          headerName: 'Gene Symbol',
          field: 'gene_symbol',
          filter: 'agTextColumnFilter',
          hide: true,
        },
        {
          headerName: 'Uniprot',
          field: 'uniprot_source',

          cellRenderer: function(params) {
            console.log(params);
            if (true) {
              return (
                '<a href="https://www.uniprot.org/uniprot/' +
                params.value.uniprot_id +
                '"rel="noopener">' +
                params.value.uniprot_id +
                '</a>'
              );
            } else {
              return (
                '<a href="http://www.ymdb.ca/compounds/' +
                params.value.id +
                '"rel="noopener">' +
                'YMDB' +
                '</a>'
              );
            }
          },
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
       frameworkComponents: { CustomToolPanel: CustomToolPanel, taxonomyFilter: TaxonomyFilter, partialMatchFilter: PartialMatchFilter, 
        tanitomoFilter: TanitomoFilter }
    };

    this.getNewSearch = this.getNewSearch.bind(this);
    this.formatProteinMetadata = this.formatProteinMetadata.bind(this);
    this.processProteinData = this.processProteinData.bind(this);
    this.formatData = this.formatData.bind(this);

    this.checkURL = this.checkURL.bind(this);
  }
  componentDidMount() {
    this.checkURL();
  }

  componentDidUpdate(prevProps) {
    // respond to parameter change in scenario 3

    if (
      this.props.match.params.molecule != prevProps.match.params.molecule ||
      this.props.match.params.organism != prevProps.match.params.organism ||
      this.props.match.params.searchType != prevProps.match.params.searchType
    ) {
      this.setState({
        search: '',
        proteinMetadata: [],
        orthologyMetadata: [],
        f_abundances: null,
        organism: '',
        dataSource: [],
        orig_json: null,
        newSearch: false,
        new_url: '',
        isFlushed: false,
        data_arrived: false,
      });
      this.checkURL();
    }
  }

  checkURL() {
    console.log('Calling checkURL');
    let url =
      '/protein/' +
      this.props.match.params.searchType +
      '/' +
      this.props.match.params.molecule;
    if (this.props.match.params.organism) {
      url = url + '/' + this.props.match.params.organism;
    }
    this.setState({ newSearch: false });
    this.setState({ new_url: url });
    this.getSearchData();
  }

  getNewSearch(response) {
    let url = '/general/?q=' + response[0] + '&organism=' + response[1];
    this.setState({ new_url: url });
    this.setState({ newSearch: true });
  }

  getSearchData() {
    let values = queryString.parse(this.props.location.search);
    console.log('Calling getSearchData');
    if (this.props.match.params.searchType == 'uniprot') {
      getSearchData([
        'proteins',
        'proximity_abundance',
        '?uniprot_id=' +
          this.props.match.params.molecule +
          '&distance=100&depth=100',
      ]).then(response => {
        this.processProteinDataUniprot(response.data);
      });
    } else if (this.props.match.params.searchType == 'name') {
      getSearchData([
        'proteins',
        'meta/meta_single/?name=' + this.props.match.params.molecule,
      ]).then(response => {
        this.formatOrthologyMetadata(response.data);
        this.setState({ proteinMetadata: null });
      });
      this.setState({ f_abundances: null });
    } else if (this.props.match.params.searchType == 'ko') {
      getSearchData([
        'proteins',
        'proximity_abundance/proximity_abundance_kegg/?kegg_id=' + values.ko + 
        "&anchor=" + values.organism + "&distance=100&depth=100",
      ]).then(response => {
        this.processProteinDataUniprot(response.data);
      });

      if ((values.organism != null) && (values.organism != "undefined")){
        getSearchData([
          'taxon',
          'canon_rank_distance_by_name/?name=' + values.organism,
        ]).then(response => {
          this.props.dispatch(set_lineage(response.data));
        });
      }


    }
  }

  formatProteinMetadata(data) {
    console.log('Calling formatProteinMetadata');
    let newProteinMetadata = [];
    let start = 0;
    //console.log(data[0])
    if (data[0].length == 1) {
      start = 1;
    }
    for (var i = start; i < data.length; i++) {
      if ((data[i].uniprot_id == this.props.match.params.molecule) && (this.props.match.params.searchType != "ko")) {
        let meta = {};
        meta['uniprot'] = data[i].uniprot_id;
        meta['protein_name'] = data[i].protein_name;
        meta['gene_name'] = data[i].gene_name;
        meta['organism'] = data[i].species_name;
        newProteinMetadata.push(meta);

        getSearchData([
          'taxon',
          'canon_rank_distance/?ncbi_id=' + data[i].ncbi_taxonomy_id,
        ]).then(response => {
          this.props.dispatch(set_lineage(response.data));
        });
      }
    }

    this.setState({ proteinMetadata: newProteinMetadata });
  }

  formatOrthologyMetadata(data) {
    console.log('Calling formatOrthologyMetadata');
    let newOrthologyMetadata = [];
    let start = 0;
    //let end_query = ""

    for (var i = start; i < data.length; i++) {
      let end_query = '';
      let meta = {};
      console.log("KO HERE: " + data[i].ko_number + " " + (data[i].ko_number==""))
      if (!(data[i].ko_number =="no number")){
      meta['ko_number'] = data[i].ko_number;
      meta['ko_name'] = data[i].ko_name;
      let uni_ids = data[i].uniprot_ids;
      //meta["uniprot_ids"] = uni_ids
      //meta["uniprot_ids"]
      let filtered_ids = Object.keys(uni_ids)
        .filter(function(k) {
          return uni_ids[k];
        })
        .map(String);
      if (filtered_ids.length > 0) {
        for (var f = filtered_ids.length - 1; f >= 0; f--) {
          end_query = end_query + 'uniprot_id=' + filtered_ids[f] + '&';
        }
        getSearchData(['proteins', 'meta/meta_combo?' + end_query]).then(
          response => {
            this.formatOrthologyMetadataUniprot(response.data);
            newOrthologyMetadata.push(meta);

          },
        );
      }
    }}
  }

  formatOrthologyMetadataUniprot(data) {
    console.log('Calling formatOrthologyMetadataUniprot');
    let newOrthologyMetadata = this.state.orthologyMetadata;
    let start = 0;
    let uni_ids = [];
    let meta = {};
    meta['ko_number'] = data[0].ko_number;
    meta['ko_name'] = data[0].ko_name;

    for (var i = start; i < data.length; i++) {
      uni_ids.push(data[i].uniprot_id + ' (' + data[i].species_name + ') ');
    }
    meta['uniprot_ids'] = uni_ids;
    newOrthologyMetadata.push(meta);
    this.setState({ orthologyMetadata: newOrthologyMetadata });
    //this.formatProteinMetadata(data)
  }

  processProteinData(data) {
    console.log('Calling processProteinData');
    if (typeof data != 'string') {
      this.setState({ orig_json: data });
      if (this.props.match.params.searchType == 'uniprot') {
        this.formatUniprotData(data);
      } else {
        this.formatData(data);
      }
      //this.formatData(data)
      this.formatProteinMetadata(data);
      let newOrthologyMetadata = [];
      let meta = {};
      let uniprot_id = '';
      if (Object.size(data[0]) == 1) {
        uniprot_id = data[1].uniprot_id;
      } else {
        uniprot_id = data[0].uniprot_id;
      }
      meta['ko_number'] = [data[0].ko_number, uniprot_id];
      newOrthologyMetadata.push(meta);
      this.setState({ orthologyMetadata: newOrthologyMetadata });
    } else {
      getSearchData([
        'proteins',
        'meta?uniprot_id=' + this.props.match.params.molecule,
      ]).then(response => {
        this.formatData(response.data);
        this.formatProteinMetadata(response.data);

        let newOrthologyMetadata = [];
        let meta = {};
        meta['ko_number'] = [
          response.data[0].ko_number,
          response.data[1].uniprot_id,
        ];
        newOrthologyMetadata.push(meta);
        this.setState({ orthologyMetadata: newOrthologyMetadata });
      });
    }
  }

  processProteinDataUniprot(data) {
    console.log('Calling processProteinDataUniprot');
    if (typeof data != 'string') {
      this.setState({ orig_json: data });
      var f_abundances = [];
      let newProteinMetadata = [];
      let uniprot_to_dist = {};
      if (data != null && typeof data != 'string') {
        let start = 0;
        for (var i = 0; i < data.length; i++) {
          let docs = data[i].documents;
          for (var q = docs.length - 1; q >= 0; q--) {
            var uniprot = docs[q].abundances;
            for (var n = 0; n < uniprot.length; n++) {
              let row = {};
              uniprot_to_dist[docs[q].uniprot_id] = data[i].distance;
            }
          }
        }
      }
      let total_ids = Object.keys(uniprot_to_dist);
      let end_query = '';
      for (var f = total_ids.length - 1; f >= 0; f--) {
        end_query = end_query + 'uniprot_id=' + total_ids[f] + '&';
      }
      getSearchData(['proteins', 'meta/meta_combo?' + end_query]).then(
        response => {
          this.formatOrthologyMetadataUniprot(response.data);
          this.formatProteinMetadata(response.data);
          this.formatData(response.data, uniprot_to_dist);
        },
      );
    }
  }

  formatData(data, uniprot_to_dist) {
    console.log('Calling formatData');
    var f_abundances = [];
    if (data != null && typeof data != 'string') {
      if (!(data[0].uniprot_id == "Please try another input combination")) {
        let start = 0;
        if (Object.size(data[0]) == 1) {
          start = 1;
        }
        for (var i = start; i < data.length; i++) {
          let uniprot = data[i];
          for (var n = 0; n < uniprot.abundances.length; n++) {
            let row = {};
            row['abundance'] = uniprot.abundances[n].abundance;
            row['organ'] = uniprot.abundances[n].organ;
            row['gene_symbol'] = uniprot.gene_name;
            row['organism'] = uniprot.species_name;
            row['uniprot_id'] = uniprot.uniprot_id;
            row['uniprot_source'] = { uniprot_id: uniprot.uniprot_id }
            row['protein_name'] = uniprot.protein_name;
            row['taxonomic_proximity'] = uniprot_to_dist[uniprot.uniprot_id];
            row['source_link'] = { uniprot_id: uniprot.uniprot_id }
            f_abundances.push(row);
          }
        }
        this.props.dispatch(setTotalData(f_abundances));
        this.setState({ data_arrived: true });
      }
        else {
          //alert('Nothing Found');
        }
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
    console.log(event)
    console.log(event.api.getSelectedNodes());
    let selectedRows = [];
    if (event.api.getSelectedNodes() > 0){
      for (var i = event.api.getSelectedNodes().length - 1; i >= 0; i--) {
        selectedRows.push(event.api.getSelectedNodes()[i].data);
      }
      this.props.dispatch(setSelectedData(selectedRows));
  }
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
    if (this.state.newSearch == true) {
      console.log('Redirecting');
      return <Redirect to={this.state.new_url} push />;
    }
    console.log('Rendering ProteinPage');
    const values = queryString.parse(this.props.location.search);


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

      <div className="metabolite_definition_data">
      </div>





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

export default withRouter(ProteinPage);
