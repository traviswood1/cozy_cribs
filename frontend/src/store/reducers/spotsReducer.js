import * as types from '../actionTypes';

const initialState = {
    allSpots: [],
    singleSpot: null,
    isLoading: false,
    error: null
};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_SPOTS:
            return {
                ...state,
                allSpots: action.payload,
                isLoading: false,
                error: null
            };
        case types.SET_SINGLE_SPOT:
            return {
                ...state,
                singleSpot: action.payload,
                error: null
            };
        case types.ADD_SPOT:
            return {
                ...state,
                allSpots: [...state.allSpots, action.payload],
                error: null
            };
        case types.REMOVE_SPOT:
            return {
                ...state,
                allSpots: state.allSpots.filter(spot => spot.id !== action.payload),
                singleSpot: state.singleSpot?.id === action.payload ? null : state.singleSpot,
                error: null
            };
        case types.UPDATE_SPOT:
            return {
                ...state,
                allSpots: state.allSpots.map(spot => 
                    spot.id === action.payload.id ? action.payload : spot
                ),
                error: null
            };
        default:
            return state;
    }
};

export default spotsReducer; 