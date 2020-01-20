function setLineage(lineageList) {
  return function(dispatch) {
    dispatch({
      type: "SET_LINEAGE",
      payload: lineageList
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
export { setLineage, setTotalData, setSelectedData };
