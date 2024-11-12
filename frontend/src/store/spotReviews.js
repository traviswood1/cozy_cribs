import { csrfFetch } from './csrf';

const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const DELETE_REVIEW = 'reviews/deleteReview';
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

export const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    reviews
});

export const addReview = (review) => ({
    type: ADD_REVIEW,
    review,
});

export const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    review,
});

export const fetchReviewsBySpotId = (spotId) => async (dispatch) => {
    try {
        console.log('Fetching reviews for spotId:', spotId);
        const response = await fetch(`/api/spots/${spotId}/reviews`);
        if (response.ok) {
            const reviews = await response.json();
            console.log('Fetched reviews:', reviews);
            dispatch(setReviews(reviews));
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
    try {
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
        dispatch(addReview(newReview));
        
        // Fetch updated reviews and spot details
        await Promise.all([
            dispatch(fetchReviewsBySpotId(spotId)),
            dispatch(fetchSpotById(spotId)) // Add this import from your spots store
        ]);
        
        return newReview;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

export const editReview = (reviewId, reviewData) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    dispatch(updateReview(data));
};

export const deleteReview = (reviewId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            dispatch(removeReview(reviewId));
            return { success: true };
        }
    } catch (error) {
        console.error('Delete review error:', error);
        return { success: false, error };
    }
};

export const removeReview = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId
});

const initialState = {
    reviews: []
};

const spotReviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REVIEWS:
            return {
                ...state,
                reviews: action.reviews.Reviews || []
            };
        case ADD_REVIEW:
            return {
                ...state,
                reviews: [...state.reviews, action.review]
            };
        case DELETE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.filter(review => review.id !== action.reviewId)
            };
        case UPDATE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.map(review => 
                    review.id === action.review.id ? action.review : review
                )
            };
        case REMOVE_REVIEW:
            const newState = { ...state };
            const newReviews = newState.reviews.filter(review => review.id !== action.reviewId);
            return {
                ...newState,
                reviews: newReviews
            };
        default:
            return state;
    }
};

export default spotReviewsReducer;