
function getTotalColumns(desired_columns) {
    return function(dispatch) {
    dispatch({
      type: 'CREATE_COLUMNS',
      payload: desired_columns,
    });
  };


}

export { getTotalColumns };