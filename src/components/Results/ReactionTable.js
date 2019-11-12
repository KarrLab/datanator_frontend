import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router';
//import './ConcentrationsTable.css';
import { ResultsTable } from './components/ResultsTable.js';
import { TaxonFilter } from '~/components/Results/components/Filters/TaxonFilter';
import { TanitomoFilter } from '~/components/Results/components/Filters/TanitomoFilter';
import { Consensus } from './components/Consensus.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {total_columns} from '~/data/reducers/resultsReducer';
import { ResultsPageTemplate } from '~/components/Results/ResultsPageTemplate';



const default_first_columns = ['reaction_id','kcat',]
const default_second_columns = [
                  'molecule',
                  'organism',
                  'taxonomic_proximity',
                ];



@connect(store => {
  return {
    columns: store.results.columns,
  };
})


/**
 * Class putting together the components of Results to construct the 
 * correct table for metabolite concentrations
 */
class ReactionTable extends Component {
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


    /**
     * a list of the different km values. Each one will be made into a column
     */
    km_values: PropTypes.array,

  };
  constructor(props) {
    super(props);


    this.state = {

      basic_columns:default_first_columns.concat(default_second_columns),

      advanced_columns:[
                  'ph',
                  'temperature',
                  'enzyme'
                ],

    }
  };


  setKmColumns(){
    let new_columns = []
    let km_values = this.props.km_values
    for (var i = km_values.length - 1; i >= 0; i--) {
      total_columns[km_values[i]] = {
        dataField: km_values[i],
        text: 'Km ' + km_values[i].split("_")[1] + ' (M)',
        headerStyle: (colum, colIndex) => {
          return { width: '9%', textAlign: 'left' };
        }
      }
      new_columns.push(km_values[i])
    }

    let final_columns = default_first_columns.concat(new_columns)
   final_columns = final_columns.concat(default_second_columns)
    this.setState({basic_columns:final_columns})



  }

  componentDidMount(prevProps){
    if (this.props.km_values){
      this.setKmColumns()
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.km_values != this.props.km_values){
      this.setKmColumns()
    }
  }


  render() {
    console.log('Rendering ConcentrationsTable');


    if (!this.props.data_arrived) {
      return <div></div>;
    } else {
      return (
        <div >
          <ResultsPageTemplate
              filters = {[
                <TaxonFilter />,
                <TanitomoFilter tanitomo={this.props.tanitomo} />
                ]}
              table = {<ResultsTable
                basic_columns={this.state.basic_columns}
                advanced_columns={this.state.advanced_columns}
                potential_columns={{}}
              />}
              relevantColumns = {["kcat"].concat(this.props.km_values)}
              //optional_columns = {["error"]}
          />
        </div>
      );
    }
  }
}

export default withRouter(ReactionTable);

