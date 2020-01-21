function setNewUrl(newUrl) {
  return function(dispatch) {
    dispatch({
      type: "NEW_REDIRECT",
      payload: newUrl
    });
  };
}

function abstractMolecule(abstractBool) {
  return function(dispatch) {
    dispatch({
      type: "ABSTRACT_MOLECULE",
      payload: abstractBool
    });
  };
}

export { setNewUrl, abstractMolecule };
