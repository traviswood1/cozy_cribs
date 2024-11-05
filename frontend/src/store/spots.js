
import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const SET_SINGLE_SPOT = 'spots/SET_SINGLE_SPOT';
const ADD_SPOT = 'spots/ADD_SPOT';
const REMOVE_SPOT = 'spots/REMOVE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const SET_SPOT = 'spots/SET_SPOT';

// Action Creators
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots
});

export const setSingleSpot = (spot) => ({
    type: SET_SINGLE_SPOT,
    payload: spot
});

export const addSpot = (spot) => ({
    type: ADD_SPOT,
    payload: spot
});

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    payload: spotId
});

export const updateSpotAction = (spot) => ({
    type: UPDATE_SPOT,
    payload: spot
});

export const setSpot = (spot) => ({
    type: SET_SPOT,
    spot
});

// Thunks
export const fetchSpots = () => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/spots');
        if (response.ok) {
            const spots = await response.json();
            dispatch(loadSpots(spots.Spots));
            return spots;
        }
    } catch (error) {
        console.error('Error fetching spots:', error);
    }
};

export const fetchSpotById = (spotId) => async (dispatch) => {
    try {
        console.log(`Fetching spot with id ${spotId} from API...`);
        const response = await csrfFetch(`/api/spots/${spotId}`);
        if (response.ok) {
            const spot = await response.json();
            console.log('Spot received from API:', spot);
            dispatch(setSingleSpot(spot));
            return spot;
        }
    } catch (error) {
        console.error('Error fetching spot:', error);
    }
};

export const createSpot = (spotData) => async (dispatch) => {
    try {
        console.log('Creating new spot with data:', spotData);
        const response = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(spotData),
        });
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            console.log('New spot created:', data);
            dispatch(addSpot(data));
            return data;
        } else {
            console.error('Error response:', data);
            throw data;
        }
    } catch (error) {
        console.error('Error creating spot:', error);
        throw error;
    }
};

export const deleteSpot = (spotId) => async (dispatch) => {
    try {
        console.log(`Deleting spot with id ${spotId}...`);
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log(`Spot ${spotId} deleted successfully`);
            dispatch(removeSpot(spotId));
            return { success: true };
        }
    } catch (error) {
        console.error('Error deleting spot:', error);
        return { success: false, error };
    }
};

export const updateSpot = (spotId, spotData) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spotData)
        });

        if (response.ok) {
            const updatedSpot = await response.json();
            dispatch(setSpot(updatedSpot));
            return updatedSpot;
        }
    } catch (error) {
        console.error('Error updating spot:', error);
        throw error;
    }
};

// Initial State
const initialState = {
    allSpots: null,
    singleSpot: null
};

// Reducer
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            return {
                ...state,
                allSpots: action.payload.reduce((acc, spot) => {
                    acc[spot.id] = spot;
                    return acc;
                }, {})
            };
        case SET_SINGLE_SPOT:
            console.log('SET_SINGLE_SPOT action dispatched with payload:', action.payload);
            return {
                ...state,
                singleSpot: action.payload
            };
        case ADD_SPOT:
            console.log('ADD_SPOT action dispatched with payload:', action.payload);
            return {
                ...state,
                allSpots: {
                    ...state.allSpots,
                    [action.payload.id]: action.payload
                }
            };
        case REMOVE_SPOT:
            console.log('REMOVE_SPOT action dispatched with payload:', action.payload);
            return {
                ...state,
                allSpots: state.allSpots ? {
                    ...state.allSpots,
                    Spots: state.allSpots.Spots.filter(spot => spot.id !== action.payload)
                } : state
            };
        case UPDATE_SPOT:
            console.log('UPDATE_SPOT action dispatched with payload:', action.payload);
            return {
                ...state,
                allSpots: state.allSpots ? {
                    ...state.allSpots,
                    Spots: state.allSpots.Spots.map(spot => 
                        spot.id === action.payload.id ? action.payload : spot
                    )
                } : null,
                singleSpot: state.singleSpot && state.singleSpot.id === action.payload.id ? action.payload : state.singleSpot
            };
        case SET_SPOT:
            return {
                ...state,
                singleSpot: {
                    ...action.spot,
                    SpotImages: action.spot && action.spot.SpotImages 
                        ? action.spot.SpotImages.map(img => ({...img}))
                        : []
                }
            };
        default:
            return state;
    }
};

export default spotsReducer;
