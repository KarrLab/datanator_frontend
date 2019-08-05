import organismReducer from './organismReducer';
import resultsReducer from './resultsReducer';

function combined(state = {}, action) {
  return {
    organisms: organismReducer(state.organisms, action),
    results: resultsReducer(state.results, action)
  };
}

export default combined;
