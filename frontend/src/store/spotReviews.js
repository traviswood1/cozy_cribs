import { csrfFetch } from './csrf';

// Action creators
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';

const addReview = (review) => ({
    type: ADD_REVIEW,
    payload: review
});

const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    payload: reviews
});

// Thunks
export const createReview = (spotId, reviewData) => async (dispatch) => {
    try {
        console.log('Creating review in thunk...');
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        const newReview = await response.json();
        console.log('Review created:', newReview);
        
        dispatch(addReview(newReview));
        
        return newReview;
    } catch (error) {
        console.error('Error in createReview thunk:', error);
        throw error;
    }
};

export const fetchReviewsBySpotId = (spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
        if (response.ok) {
            const reviews = await response.json();
            dispatch(loadReviews(reviews.Reviews));
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

// Reducer
const initialState = { reviews: [] };

const spotReviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REVIEW:
            return { ...state, reviews: [...state.reviews, action.payload] };
        case LOAD_REVIEWS:
            return { ...state, reviews: action.payload };
        default:
            return state;
    }
};

export default spotReviewsReducer;
