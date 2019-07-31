
function getTotalColumns(desired_columns) {
  console.log("YAR")
    return function(dispatch) {
    dispatch({
      type: 'CREATE_COLUMNS',
      payload: desired_columns,
    });
  };
}


function filter_taxon(value) {
    return function(dispatch) {
    dispatch({
      type: 'FILTER_TAXON',
      payload: value,
    });
  };
}

function set_lineage(lineage_list) {
    return function(dispatch) {
    dispatch({
      type: 'SET_LINEAGE',
      payload: lineage_list,
    });
  };
}

function set_displayed_columns(to_display_columns) {
    return function(dispatch) {
    dispatch({
      type: 'SET_DISPLAYED_COLUMNS',
      payload: to_display_columns,
    });
  };
}

export { getTotalColumns, filter_taxon, set_lineage, set_displayed_columns };