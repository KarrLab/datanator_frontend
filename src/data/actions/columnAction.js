
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

function remove_columns(to_display_columns) {
    return function(dispatch) {
    dispatch({
      type: 'REMOVE_COLUMNS',
      payload: to_display_columns,
    });
  };
}

function append_columns(to_display_columns) {
    return function(dispatch) {
    dispatch({
      type: 'APPEND_COLUMNS',
      payload: to_display_columns,
    });
  };
}


function hide_columns(to_display_columns) {
    return function(dispatch) {
    dispatch({
      type: 'HIDE_COLUMNS',
      payload: to_display_columns,
    });
  };
}


function reveal_columns(to_display_columns) {
    return function(dispatch) {
    dispatch({
      type: 'REVEAL_COLUMNS',
      payload: to_display_columns,
    });
  };
}
export { getTotalColumns, filter_taxon, set_lineage, set_displayed_columns, remove_columns, append_columns, hide_columns, reveal_columns };