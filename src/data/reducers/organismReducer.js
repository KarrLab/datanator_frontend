const defaultState= {
    organismList: [],
    fetching: false,
    fetched: false,
    error: null
};


function organismReducer(state=defaultState,action){
    if(action==undefined){
        return state;
    }
    switch(action.type){
    case "FETCH_ORGANISMS":{
        return{...state, fetching: true};
    }
    case "FETCH_ORGANISMS_REJECTED":{
        return{...state, fetching:false, error:action.payload};
    }
    case "FETCH_ORGANISMS_FULFILLED": {
        return {...state, fetching:false, fetched:true, organismList:action.payload};
    }
    default:{        
        return state;
    }}
}
export default organismReducer;