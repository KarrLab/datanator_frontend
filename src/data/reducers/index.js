import organismReducer from './organismReducer';
import columnReducer from './columnReducer';

function combined(state = {}, action) {
  return {
    organisms: organismReducer(state.organisms, action),
    columns: columnReducer(state.columns, action)
  };
}

export default combined;
