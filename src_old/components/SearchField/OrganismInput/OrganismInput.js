import React from 'react';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { connect } from 'react-redux';
import { getData } from '~/data/actions/organismAction';
import { setSelected, setActive } from '~data/actions/organismAction';

@connect(store => {
  return {
    organisms: store.organisms.organismList,
    organismsFetched: store.organisms.fetched,
    organismsFetching: store.organisms.fetching,
    organismsError: store.organisms.error,
    active: store.organisms.active,
    selected: store.organisms.select,
  };
})
class OrganismInput extends React.Component {
  componentDidMount() {
    this.props.dispatch(getData());
  }
  render() {
    return (
      <FormGroup
        helperText="Select a species from which to get data"
        label="Species"
        labelFor="species-input"
        labelInfo="(required)"
      >
        <Suggest
          fill={true}
          inputProps={{ placeholder: 'Escherichia Coli' }}
          activeItem={this.props.active}
          selectedItem={this.props.selected}
          onItemSelect={this.handleSelect.bind(this)}
          onActiveItemChange={this.handleActive.bind(this)}
          itemRenderer={this.itemRenderer}
          itemPredicate={this.filterSpecies}
          items={this.props.organisms}
          inputValueRenderer={this.inputValueRenderer}
          id="species-input"
          noResults={<MenuItem disabled={true} text="No results." />}
        />
      </FormGroup>
    );
  }

  inputValueRenderer(item) {
    return item.toString();
  }

  filterSpecies(query, species) {
    return species.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  }

  itemRenderer(item, { handleClick, modifiers }) {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        Key={item}
        onClick={handleClick}
        text={item.toString()}
        active={modifiers.active}
      />
    );
  }

  handleSelect(item, event) {
    this.props.dispatch(setSelected(item));
  }
  handleActive(item, event) {
    this.props.dispatch(setActive(item));
  }
}

export { OrganismInput };
