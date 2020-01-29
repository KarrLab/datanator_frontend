function setLineage(lineageList) {
  return function(dispatch) {
    dispatch({
      type: "SET_LINEAGE",
      payload: lineageList
    });
  };
}

function setTotalData(allData) {
  return function(dispatch) {
    dispatch({
      type: "SET_ALL_DATA",
      payload: allData
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
