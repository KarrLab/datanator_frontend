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




function filter_taxon(value) {
  taxon_filter({
    number: value,
    comparator: Comparator.LE,
  });
}

function filter_tanitomo(value) {
  tanitomo_filter({
    number: value,
    comparator: Comparator.GE,
  });
}




function getTotalColumns(desired_columns) {


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
          getFilter: filter => (taxon_filter = filter),
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
          getFilter: filter => (tanitomo_filter = filter),
        }),
      },
    };

    let total_columns = this.getTotalColumns()
    let final_columns = []
    console.log(desired_columns.length)
    for (var i = 0; i < desired_columns.length; i++) {
      console.log(desired_columns[i])
      final_columns.push(total_columns[desired_columns[i]])
    }

    console.log(final_columns)
    this.props.setColumns(final_columns)



    return(final_columns)
  }



export { getTotalColumns };
