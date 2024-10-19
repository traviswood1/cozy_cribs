import { csrfFetch } from './csrf';

const SET_REVIEWS = 'reviews/setReviews';

export const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    reviews
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

export const createReview = (reviewData) => async (dispatch) => {
    const response = await csrfFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
    });
    const data = await response.json();
    dispatch(addReview(data));
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
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });
    dispatch(deleteReview(reviewId));
};

const initialState = {
    reviews: []
};

const spotReviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REVIEWS:
            console.log('Setting reviews in reducer:', action.reviews);
            return { ...state, Reviews: action.reviews };
        default:
            return state;
    }
};

export default spotReviewsReducer;




