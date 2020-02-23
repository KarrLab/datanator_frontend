import React, { Component } from "react";
import PropTypes from "prop-types";

class TextFilter extends Component {
  static propTypes = {
    api: PropTypes.shape({
      addEventListener: PropTypes.func.isRequired,
      removeEventListener: PropTypes.func.isRequired,
      forEachNode: PropTypes.func.isRequired
    }).isRequired,
    valueGetter: PropTypes.func.isRequired,
    filterValueGetter: PropTypes.func,
    filterChangedCallback: PropTypes.func.isRequired
  };

  static defaultProps = {
    filterValueGetter: null
  };

  constructor(props) {
    super(props);

    this.selectedVals = new Set();
    this.state = {
      vals: []
    };

    this.updateVals = this.updateVals.bind(this);
    this.toggleVal = this.toggleVal.bind(this);
  }

  isFilterActive() {
    return this.selectedVals.size > 0;
  }

  componentDidMount() {
    this.updateVals();
    this.props.api.addEventListener("firstDataRendered", this.updateVals);
    this.props.api.addEventListener("rowDataChanged", this.updateVals);
    this.props.api.addEventListener("rowDataUpdated", this.updateVals);
  }

  componentDidUpdate(prevProps) {
    if (this.props.api !== prevProps.api) {
      prevProps.api.removeEventListener("firstDataRendered", this.updateVals);
      prevProps.api.removeEventListener("rowDataChanged", this.updateVals);
      prevProps.api.removeEventListener("rowDataUpdated", this.updateVals);

      this.updateVals();
      this.props.api.addEventListener("firstDataRendered", this.updateVals);
      this.props.api.addEventListener("rowDataChanged", this.updateVals);
      this.props.api.addEventListener("rowDataUpdated", this.updateVals);
    }
  }

  updateVals() {
    const unorderedVals = new Set();
    this.props.api.forEachNode(node => {
      const getter = this.props.filterValueGetter || this.props.valueGetter;
      const value = getter(node);
      if (value != null && value !== undefined && value !== "") {
        unorderedVals.add(value);
      }
    });

    const orderedValues = Array.from(unorderedVals.values());
    orderedValues.sort();

    const vals = [];
    for (const val of orderedValues) {
      vals.push({
        index: vals.length,
        val: val,
        selected: false
      });
    }

    this.setState({
      vals: vals
    });
    this.selectedVals.clear();
  }

  doesFilterPass(params) {
    if (this.selectedVals.size === 0) {
      return true;
    } else {
      const getter = this.props.filterValueGetter || this.props.valueGetter;
      const value = getter(params.node);
      return this.selectedVals.has(value);
    }
  }

  getModel() {
    return this.selectedVals;
  }

  setModel(selectedVals) {
    if (selectedVals == null) {
      selectedVals = new Set();
    }

    const vals = this.state.vals;
    if (selectedVals.size === 0) {
      for (let iVal = 0; iVal < vals.length; iVal++) {
        vals[iVal].selected = false;
      }
    } else {
      for (let iVal = 0; iVal < vals.length; iVal++) {
        vals[iVal].selected = selectedVals.has(vals[iVal].val);
      }
    }

    this.setState({ vals: vals });
    this.selectedVals = selectedVals;
    this.props.filterChangedCallback();
  }

  toggleVal(val, event) {
    if (event.target.checked) {
      this.selectedVals.add(val.val);
    } else {
      this.selectedVals.delete(val.val);
    }

    const vals = this.state.vals;
    vals[val.index].selected = event.target.checked;

    this.setState({ vals: vals }, () => {
      this.props.filterChangedCallback();
    });
  }

  render() {
    return (
      <ul className="biochemical-entity-scene-filter biochemical-entity-scene-text-filter">
        {this.state.vals.map(val => {
          return (
            <li key={val.val} title={val.val}>
              <input
                type="checkbox"
                checked={val.selected}
                onChange={this.toggleVal.bind(this, val)}
              />
              <span className="label">{val.val}</span>
            </li>
          );
        })}
      </ul>
    );
  }
}

export { TextFilter };
