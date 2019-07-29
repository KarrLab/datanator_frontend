const defaultState = {
  organismList: [],
  fetching: false,
  fetched: false,
  error: null,
};

function organismReducer(state = defaultState, action) {
  if (action === undefined) {
    return state;
  }
  switch (action.type) {
    case 'FETCH_ORGANISMS_PENDING': {
      return { ...state, fetching:true, organismList: ['Loading...'] };
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
    default: {
      return state;
    }
  }
}
export default organismReducer;
