
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

export { getTotalColumns, filter_taxon, set_lineage };