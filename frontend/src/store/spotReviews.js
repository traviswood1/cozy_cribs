import * as types from './actionTypes';

const initialState = {
    reviews: [],
    isLoading: false,
    error: null
};

const spotReviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOAD_REVIEWS:
            return {
                ...state,
                reviews: Array.isArray(action.payload) ? action.payload : [],
                isLoading: false,
                error: null
            };
            
        case types.ADD_REVIEW:
            return {
                ...state,
                reviews: [...state.reviews, action.payload],
                error: null
            };
            
        case types.REMOVE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.filter(review => review.id !== action.payload),
                error: null
            };
            
        default:
            return state;
    }
};

export default spotReviewsReducer;
