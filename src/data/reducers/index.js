import { combineReducers } from 'redux';
import organismReducer from './organismReducer';

function combined(state = {}, action) {
  return {
    organisms: organismReducer(state.organisms, action),
  };
}

export default combined;
