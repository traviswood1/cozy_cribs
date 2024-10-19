// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SPOT = 'spots/LOAD_SPOT';  // New action type

// Action Creators
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots
});

export const loadSpot = (spot) => ({  // New action creator
    type: LOAD_SPOT,
    payload: spot
});

// Thunk Action Creator
export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpots(data.Spots)); // Assuming the API returns { Spots: [...] }
    }
};

export const fetchSpotById = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpot(data));  // Now using the correct action creator
    }
};

// Initial State
const initialState = {
    allSpots: [],
    currentSpot: null  // Add this to store the currently viewed spot
};

// Reducer
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            console.log('LOAD_SPOTS action received:', action);
            return { ...state, allSpots: action.payload };
        case LOAD_SPOT:
            console.log('LOAD_SPOT action received:', action);
            return { ...state, currentSpot: action.payload };
        default:
            return state;
    }
};

export default spotsReducer;
