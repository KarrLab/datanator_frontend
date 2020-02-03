function setAllData(allData) {
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

export { setAllData, setSelectedData };
