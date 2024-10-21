// Action Types
const LOAD_SPOT_IMAGES = 'spotImages/LOAD_SPOT_IMAGES';

// Action Creators
export const loadSpotImages = (spotId, images) => ({
    type: LOAD_SPOT_IMAGES,
    spotId,
    payload: images
});

// Thunk Action Creator
export const fetchSpotImages = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotImages(spotId, data.SpotImages || []));
    }
};

// Initial State
const initialState = {};

// Reducer
const spotImagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOT_IMAGES:
            return { 
                ...state, 
                [action.spotId]: action.payload 
            };
        default:
            return state;
    }
};

export default spotImagesReducer;
