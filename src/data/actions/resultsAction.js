function setAllData(allData) {
  return function(dispatch) {
    dispatch({
      type: "SET_ALL_DATA",
      payload: allData
    });
  };
}

export { setAllData };
