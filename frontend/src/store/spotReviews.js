import { csrfFetch } from './csrf';

const SET_REVIEWS = 'reviews/setReviews';
const ADD_REVIEW = 'reviews/addReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const DELETE_REVIEW = 'reviews/deleteReview';

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
        console.log('Creating review for spot:', spotId, 'with data:', reviewData);
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server responded with an error:', response.status, errorData);
            throw errorData;
        }
        const data = await response.json();
        console.log('Review created successfully:', data);
        dispatch(addReview(data));
        return data;
    } catch (error) {
        console.error('Error in createReview:', error);
        if (error.json) {
            const errorData = await error.json();
            console.error('Error details:', errorData);
        }
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
    await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    dispatch({ type: 'DELETE_REVIEW', reviewId });
};

const initialState = {
    reviews: []
};

const spotReviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REVIEWS:
            return {
                ...state,
                reviews: action.reviews.Reviews // Note the capital R in Reviews
            };
        case DELETE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.filter(review => review.id !== action.reviewId)
            };
        default:
            return state;
    }
};

export default spotReviewsReducer;
