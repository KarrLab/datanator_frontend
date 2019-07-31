
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

export { getTotalColumns, filter_taxon };