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
import { getTotalColumns, filter_tanitomo, refreshSelectedData } from '~/data/actions/resultsAction';
import { abstractMolecule } from '~/data/actions/pageAction';

const selectOptions = {
  'Stationary Phase': 'Stationary Phase',
  'Log Phase': 'Log Phase',
};



@connect(store => {
  return {
    currentUrl: store.page.url,
  };
})


class TanitomoFilter extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
    this.filter_tanitomo = this.filter_tanitomo.bind(this);
    this.setAbstractUrl = this.setAbstractUrl.bind(this)
  }

  


  filter_tanitomo(value) {
    this.props.dispatch(filter_tanitomo(value))
  }

  setAbstractUrl(){
    console.log("blue")
    this.props.dispatch(abstractMolecule(true))
  }






  render() {
        
return (

          <div className="slider_bar2">

            {!this.props.tanitomo && (
              <Button type="primary" onClick={() => this.setAbstractUrl()}>
                {' '}
                Include Similar Compounds{' '}
              </Button>
            )}

            {this.props.tanitomo && (
              <div className="tani">
              Molecular Similarity 
              <Slider
                step={0.01}
                defaultValue={0.65}
                min={0.65}
                max={1}
                onChange={this.filter_tanitomo}
              />
              </div>
            )}

        </div>
  )}

}


export { TanitomoFilter };
