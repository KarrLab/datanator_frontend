import React, { Component } from 'react';
import filterFactory, {
  textFilter,
  selectFilter,
  numberFilter,
  Comparator,
} from 'react-bootstrap-table2-filter';
import { Input, Button } from 'antd';
import 'antd/dist/antd.css';
import { Slider } from 'antd';
const selectOptions = {
  'Stationary Phase': 'Stationary Phase',
  'Log Phase': 'Log Phase',
};

class Columns extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      marks: {},
      numToNode: { 0: 0 },
      sliderLen: 100 
    };
    this.getTotalColumns = this.getTotalColumns.bind(this);
    this.formatSlider = this.formatSlider.bind(this);
    this.formatter = this.formatter.bind(this);
    this.filter_taxon = this.filter_taxon.bind(this);
    this.filter_tanitomo = this.filter_tanitomo.bind(this);
  }

  getTotalColumns() {
    let column_dict = {
      concentration: {
        dataField: 'concentration',
        text: 'Conc. (µM)',
      },

      error: {
        dataField: 'error',
        text: 'Error',
      },
      molecule: {
        dataField: 'name',
        text: 'Molecule',
        filter: textFilter(),
      },
      organism: {
        dataField: 'organism',
        text: 'Organism',
        filter: textFilter(),
      },

      taxonomic_proximity: {
        dataField: 'taxonomic_proximity',
        text: 'Taxonomic Distance',

        headerStyle: (colum, colIndex) => {
          return { width: '20px', textAlign: 'left' };
        },

        filter: numberFilter({
          placeholder: 'custom placeholder',
          defaultValue: { comparator: Comparator.LE, number: 1000 }, //ref:this.node,
          getFilter: filter => (this.taxon_filter = filter),
        }),
        sort: true,
      },

      growth_phase: {
        dataField: 'growth_phase',
        text: 'Growth Phase',
        formatter: cell => selectOptions[cell],
        filter: selectFilter({
          options: selectOptions,
        }),
      },

      growth_conditions: {
        dataField: 'growth_conditions',
        text: 'Conditions',
        filter: textFilter(),
      },
      growth_media: {
        dataField: 'growth_media',
        text: 'Media',
        filter: textFilter(),
      },

      tanitomo: {
        dataField: 'tanitomo_similarity',
        text: 'Tanitomo Score',
        headerStyle: (colum, colIndex) => {
          return { width: '20px', textAlign: 'left' };
        },
        filter: numberFilter({
          placeholder: 'custom placeholder',
          defaultValue: { comparator: Comparator.GE, number: 0.5 }, //ref:this.node,
          getFilter: filter => (this.tanitomo_filter = filter),
        }),
      },
    };
    return(column_dict)
  }

  filter_taxon(value) {
    this.taxon_filter({
      number: value,
      comparator: Comparator.LE,
    });
  }

  filter_tanitomo(value) {
    this.tanitomo_filter({
      number: value,
      comparator: Comparator.GE,
    });
  }

  formatSlider(data) {
    const lineage = data[2][0];
    this.setState({ sliderLen: lineage.length - 1 });

    var new_marks = {};
    var new_numToNode = {};
    var n = lineage.length - 1;
    for (var i = 0; i < lineage.length; i++) {
      new_numToNode[i] = lineage[n];
      new_marks[i] = i;
      n--;
    }

    this.setState({
      numToNode: new_numToNode,
      marks: new_marks,
    });
  }

  formatter(value) {
    if (this.state.numToNode[value]) {
      return `${this.state.numToNode[value]}`;
    } else {
      return `${''}`;
    }
  }


  componentDidMount() {
    console.log(this.props.desired_columns)
    let desired_columns = this.props.desired_columns
    let total_columns = this.getTotalColumns()
    let final_columns = []
    console.log(desired_columns.length)
    for (var i = 0; i < desired_columns.length; i++) {
      console.log(desired_columns[i])
      final_columns.push(total_columns[desired_columns[i]])
    }
    if (this.props.taxon_data) {
      this.formatSlider(this.props.taxon_data);
    }
    console.log(final_columns)
    this.props.setColumns(final_columns)
  }



  render() {
        
return (
        <div className="slider">
          Taxonomic Distance
          <div className="slider_bar">
            <Slider
              marks={this.state.marks}
              defaultValue={this.state.sliderLen}
              tipFormatter={this.formatter}
              onChange={this.filter_taxon}
              max={this.state.sliderLen}
            />
          </div>
          <br></br>
          Molecular Similarity
          <div className="slider_bar2">
            {!this.state.tanitomo && (
              <Button type="primary" onClick={this.handleAbstractInner}>
                {' '}
                Abstract{' '}
              </Button>
            )}

            {this.state.tanitomo && (
              <Slider
                step={0.01}
                defaultValue={0.65}
                min={0.65}
                max={1}
                onChange={this.filter_tanitomo}
              />
            )}
          </div>
          <br />
          <br />
        </div>
  )}







}














export { Columns };
