import organismReducer from "./organismReducer";
import resultsReducer from "./resultsReducer";

function reducer(state = {}, action) {
  return {
    organisms: organismReducer(state.organisms, action),
    results: resultsReducer(state.results, action)
  };
}

export default reducer;
