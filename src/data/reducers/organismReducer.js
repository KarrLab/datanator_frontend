export const defaultState = {
  organismList: [],
  fetching: false,
  fetched: false,
  error: null,
  select: null,
  active: null,
};

function organismReducer(state = defaultState, action) {
  if (action === undefined) {
    return state;
  }
  switch (action.type) {
    case 'FETCH_ORGANISMS_PENDING': {
      return { ...state, fetching: true, organismList: ['Loading...'] };
    }
    case 'FETCH_ORGANISMS_REJECTED': {
      return {
        ...state,
        fetching: false,
        error: action.payload,
        organismList: ['Hello', 'The', 'Organism', 'Did', 'Not', 'Load'],
      };
    }
    case 'FETCH_ORGANISMS_FULFILLED': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        organismList: action.payload.data,
        status: action.payload.status,
      };
    }
    case 'SET_SELECT': {
      return {
        ...state,
        select: action.payload,
      };
    }
    case 'SET_ACTIVE': {
      return {
        ...state,
        active: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
export default organismReducer;
