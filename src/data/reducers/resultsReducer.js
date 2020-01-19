import React from "react";

const selectOptions = {
  "Stationary Phase": "Stationary Phase",
  "Log Phase": "Log Phase"
};

const selectOptionsGenetics = {
  wildtype: "wildtype",
  mutant: "mutant"
};

export const defaultState = {
  columns: {},
  column_list: [],
  taxon_lineage: null,
  totalData: null,
  selectedData: null
};

let taxonFilter;

let filters = {};

const linkFormatter = (cell, row) => {
  if (cell) {
    let url = "http://sabiork.h-its.org/reacdetails.jsp?reactid=" + cell;
    return <a href={url}>{"SabioRK ID: " + cell.toString()} </a>;
  } else {
    return <div></div>;
  }
};

let total_columns = {};

//let taxonFilter = null;
function resultsReducer(state = defaultState, action) {
  if (action === undefined) {
    return state;
  }

  switch (action.type) {
    case "SET_LINEAGE": {
      return {
        ...state,

        taxon_lineage: action.payload
      };
    }

    case "SET_TOTAL_DATA": {
      return {
        ...state,

        totalData: action.payload
      };
    }
    case "SET_SELECTED_DATA": {
      return {
        ...state,

        selectedData: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
export { resultsReducer, total_columns };
