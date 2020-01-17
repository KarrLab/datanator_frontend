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
import {
  getTotalColumns,
  filter_tanimoto,
  refreshSelectedData,
} from '~/data/actions/resultsAction';
import { abstractMolecule } from '~/data/actions/pageAction';

const selectOptions = {
  'Stationary Phase': 'Stationary Phase',
  'Log Phase': 'Log Phase',
};

@connect(store => {
  return {};
})
class TanimotoFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.filter_tanimoto = this.filter_tanimoto.bind(this);
    this.setAbstractUrl = this.setAbstractUrl.bind(this);
  }

  filter_tanimoto(value) {
    this.props.dispatch(filter_tanimoto(value));
  }

  setAbstractUrl() {
    this.props.dispatch(abstractMolecule(true));
  }

  render() {
    console.log('Rendering TanimotoFilter');

    return (
      <div className="tanimoto_slider">
        {!this.props.tanimoto && (
          <Button
            type="primary"
            onClick={() => this.setAbstractUrl()}
            data-testid="tanimoto_button"
          >
            {' '}
            Include Similar Compounds{' '}
          </Button>
        )}

        {this.props.tanimoto && (
          <div className="tani">
            Molecular Similarity
            <Slider
              step={0.01}
              defaultValue={0.65}
              min={0.65}
              max={1}
              onChange={this.filter_tanimoto}
            />
          </div>
        )}
      </div>
    );
  }
}

export { TanimotoFilter };
