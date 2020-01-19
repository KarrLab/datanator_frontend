function set_lineage(lineage_list) {
  return function(dispatch) {
    dispatch({
      type: "SET_LINEAGE",
      payload: lineage_list
    });
  };
}

function setTotalData(totalData) {
  return function(dispatch) {
    dispatch({
      type: "SET_TOTAL_DATA",
      payload: totalData
    });
  };
}
function setSelectedData(selectedData) {
  return function(dispatch) {
    dispatch({
      type: "SET_SELECTED_DATA",
      payload: selectedData
    });
  };
}
export { set_lineage, setTotalData, setSelectedData };
