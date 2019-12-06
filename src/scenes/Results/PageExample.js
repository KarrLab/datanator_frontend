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

/*
concentration
reaction_id
error
molecule
organism
taxonomic_proximity
filter
growth_phase
wildtype_mutant
growth_conditions
growth_media
tanitomo
genetic_identifiers
abundance
kcat
ph
temperature
organ
enzyme
gene_symbol
protein_name
uniprot_id
*/

const data = [
  { name: 'Trajan', concentration: 98, abundance: 117, gene_symbol: 'dhs',},
  { name: 'Hadrian', concentration: 117, abundance: 138, gene_symbol: 'asa' },
  { name: 'Antoninus ', concentration: 138, abundance: 161, gene_symbol: 'ynd' },
  { name: 'Marcus ', concentration: 161, abundance: 180, gene_symbol: 'erx' },
];

@connect(store => {
  return {};
})
class PageExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_arrived: true,
      newSearch: false,
      new_url: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(setTotalData(data));
  }

  render() {
    let styles = {
      marginTop: 50,
    };

    return (
      <div className="container" style={styles}>
        <Header />
        <style>{'body { background-color: #f7fdff; }'}</style>
        <br />
        <div className="results">
          <ExampleTable data_arrived={this.state.data_arrived} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(PageExample);
