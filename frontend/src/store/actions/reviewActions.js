import * as types from '../actionTypes';

export const loadReviews = (reviews) => ({
    type: types.LOAD_REVIEWS,
    payload: reviews
});

export const addReview = (review) => ({
    type: types.ADD_REVIEW,
    payload: review
});

export const removeReview = (reviewId) => ({
    type: types.REMOVE_REVIEW,
    payload: reviewId
}); 