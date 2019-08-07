
function setNewUrl(newUrl) {
    return function(dispatch) {
    dispatch({
      type: 'NEW_REDIRECT',
      payload: newUrl,
    });
  };
}


export { setNewUrl };