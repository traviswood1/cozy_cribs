// Action Types
const LOAD_SPOT_IMAGES = 'spotImages/LOAD_SPOT_IMAGES';

// Action Creators
export const loadSpotImages = (images) => ({
    type: LOAD_SPOT_IMAGES,
    payload: images
});

// Thunk Action Creator
export const fetchSpotImages = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/images`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotImages(data));
    }
};

// Initial State
const initialState = {
    allSpotImages: []
};

// Reducer
const spotImagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOT_IMAGES:
            return { ...state, allSpotImages: action.payload };
        default:
            return state;
    }
};

export default spotImagesReducer;
