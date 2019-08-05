
function getTotalColumns(desired_columns) {
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

function refreshSelectedData() {
    return function(dispatch) {
    dispatch({
      type: 'REFRESH_SELECTED_DATA',
    });
  };
}

function setTotalData(totalData) {
    return function(dispatch) {
    dispatch({
      type: 'SET_TOTAL_DATA',
      payload: totalData,
    });
  };
}
export { getTotalColumns, filter_taxon, set_lineage, hide_columns, reveal_columns, refreshSelectedData, setTotalData };