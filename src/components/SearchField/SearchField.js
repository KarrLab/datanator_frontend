import React, { Component } from 'react';
import { ControlGroup, Button } from '@blueprintjs/core';

import { MetaboliteInput } from './MetaboliteInput';
import { OrganismInput } from './OrganismInput';

import styles from './SearchField.css';
class SearchField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: props.type,
      name: props.name,
      dataSource: props.dataSource,
      value: props.default,
    };
  }

  render() {
    return (
      <div className="container">
        <MetaboliteInput className="metabolite" />
        <OrganismInput className="organism" />
        <Button icon="search" className="button">
          Search
        </Button>
      </div>
    );
  }
}

export { SearchField };
