import organismReducer from './organismReducer';
import resultsReducer from './resultsReducer';
import pageReducer from './pageReducer';
function combined(state = {}, action) {
  return {
    organisms: organismReducer(state.organisms, action),
    results: resultsReducer(state.results, action),
    page: pageReducer(state.page, action)
  };
}

export default combined;
