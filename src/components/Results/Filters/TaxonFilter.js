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
import { connect } from 'react-redux';
import { getTotalColumns, filter_taxon, refreshSelectedData } from '~/data/actions/resultsAction';
import { abstractMolecule } from '~/data/actions/pageAction';

const selectOptions = {
  'Stationary Phase': 'Stationary Phase',
  'Log Phase': 'Log Phase',
};


function swap(json){
  var ret = {};
  for(var key in json){
    ret[json[key]] = key;
  }
  return ret;
}


@connect(store => {
  return {
    lineage: store.results.taxon_lineage,
  };
})


class TaxonFilter extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      marks: {},
      numToNode: { 0: 0 },
      sliderValue: 100,
      sliderLen: 100, 
    };
    this.formatSlider = this.formatSlider.bind(this);
    this.formatter = this.formatter.bind(this);
    this.filter_taxon_inner = this.filter_taxon_inner.bind(this);
  }

  

  filter_taxon_inner(value) {
    this.props.dispatch(filter_taxon(value))
    this.setState({sliderValue:value})
  }



  formatSlider(lineage) {
    //const lineage = this.props.lineage;
    console.log(this.props.lineage)
    let max = Object.values(lineage[lineage.length-1])[0]
    this.setState({ sliderLen: max });
    this.setState({ sliderValue: max });

    var new_marks = {};
    var new_numToNode = {};
    var n = lineage.length - 1;
    for (var i = 0; i < lineage.length; i++) {
      new_numToNode[Object.values(lineage[i])[0] ] = Object.keys(lineage[i])[0];
      //new_marks[i] = Object.values(lineage[i])[0] - 1 ;
      new_marks[Object.values(lineage[i])[0]] = Object.values(lineage[i])[0]
      n--;
    }
    console.log(new_numToNode)

    //new_numToNode = lineage

    
    /*
    let newer_numToNode = {}
    //new_numToNode = Object.assign({}, new_numToNode, lineage[n])
    for (var i = 0; i < new_numToNode.length; i++) {
      newer_numToNode = Object.assign({}, newer_numToNode, new_numToNode[i])
      i--;
    }
    console.log(newer_numToNode)

    new_numToNode = swap(newer_numToNode)
    console.log(new_numToNode)

    */

    


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

    if (this.props.lineage) {
      this.formatSlider(this.props.lineage);
    }

  }

  componentDidUpdate(prevProps){
    if (this.props.lineage != prevProps.lineage) {
      this.formatSlider(this.props.lineage)
    }

  }


  render() {
    console.log("Rendering TaxonFilter")
        
return (
        <div className="slider">
          Taxonomic Distance
          <div className="taxon_slider_bar">
            <Slider
              marks={this.state.marks}
              value={this.state.sliderValue}
              step={null}
              //defaultValue={this.state.sliderLen}
              tipFormatter={this.formatter}
              onChange={this.filter_taxon_inner}
              max={this.state.sliderLen}
            />
          </div>
        </div>
  )}


}

export { TaxonFilter };
