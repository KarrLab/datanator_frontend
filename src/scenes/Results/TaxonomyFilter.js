import React, { Component } from 'react';
import { connect } from 'react-redux';

@connect(store => {
  return {
    lineage: store.results.taxon_lineage,
  };
})
class TaxonomyFilter extends Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();

    this.state = {
      filter: '',
      numToNode: null,
      marks: [],
      buttons:[<div><label>blue</label> <input type="radio" name="gender" value="male"></input></div>, <div><label>blue</label> <input type="radio" name="gender" value="male"></input></div>]
    };

    this.valueGetter = this.props.valueGetter;

    this.onSubmit = this.onSubmit.bind(this);
    this.formatButtons = this.formatButtons.bind(this);
  }

  componentDidMount() {
    let lineage = this.props.lineage;
    let buttons =  []
    console.log(lineage)
    var new_marks = {};
    var new_numToNode = {};
    var n = lineage.length - 1;
    for (var i = lineage.length - 1; i >= 0; i--) {
      //new_numToNode[Object.values(lineage[i])[0]] = Object.keys(lineage[i])[0];
      //new_numToNode[Object.keys(lineage[i])[0]] = Object.values(lineage[i])[0]
      buttons.push(<div> <input type="radio" name="gender" value={Object.values(lineage[i])[0]}></input><label>{Object.keys(lineage[i])[0]}</label></div>)

      //buttons.push(<input type="radio" name="gender" value={Object.values(lineage[i])[0]}> {Object.keys(lineage[i])[0]} </input>)
    }

    this.setState({
      numToNode: new_numToNode,
      buttons: buttons,
    });
  }

  isFilterActive() {
    return this.state.filter !== '';
  }

  doesFilterPass(params) {
    const filter = this.state.filter.split('-');
    const gt = Number(filter[0]);
    const lt = Number(filter[1]);
    const value = this.valueGetter(params.node);

    return value >= gt && value <= lt;
  }

  getModel() {
    return { filter: this.state.filter };
  }

  setModel(model) {
    const filter = model ? model.filter : '';
    this.setState({ filter: filter });
  }

  afterGuiAttached(params) {
    this.input.current.focus();
  }

  onSubmit(event) {
    event.preventDefault();

    let filter = event.target.elements.filter.value;

    if (this.state.filter !== filter) {
      this.setState({ filter: filter }, () => {
        this.props.filterChangedCallback();
      });
    }
  }

  formatButtons(lineage){
      let buttons =  []
      for (var i = this.state.marks.length - 1; i >= 0; i--) {
        buttons.push(<input type="radio" name="gender" value="male"> this.state.marks[i] </input>)
      }
      return(buttons)
    }

  render() {
    let buttons = this.state.buttons
    return (
      <form onSubmit={this.onSubmit}>
      {buttons}

        <input
          name="filter"
          ref={this.input}
          defaultValue={this.state.filter}
        />
        <button>Apply</button>
      </form>
    );
  }
}

export { TaxonomyFilter };
