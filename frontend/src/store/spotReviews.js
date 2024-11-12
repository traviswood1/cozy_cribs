import { csrfFetch } from './csrf';
import { fetchSpotData } from './utils/spotUtils';
import { setSingleSpot } from './spots';

// Action Types
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';

// Action Creators
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
        console.log('Creating review...');
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
        console.log('Review created successfully:', newReview);
        
        // Add the new review to the store
        dispatch(addReview(newReview));

        // Fetch updated reviews
        await dispatch(fetchReviewsBySpotId(spotId));

        // Update spot data
        const updatedSpot = await fetchSpotData(spotId);
        if (updatedSpot) {
            dispatch(setSingleSpot(updatedSpot));
        }

        return newReview;
    } catch (error) {
        console.error('Error in createReview:', error);
        throw error;
    }
};

export const fetchReviewsBySpotId = (spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
        if (response.ok) {
            const data = await response.json();
            dispatch(loadReviews(data.Reviews));
            return data.Reviews;
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

// Initial State
const initialState = {
    reviews: []
};

// Reducer
const spotReviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REVIEW:
            return {
                ...state,
                reviews: [...state.reviews, action.payload]
            };
        case LOAD_REVIEWS:
            return {
                ...state,
                reviews: action.payload
            };
        default:
            return state;
    }
};

export default spotReviewsReducer;
