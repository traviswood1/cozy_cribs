import { csrfFetch } from '../csrf';
import { addReview, loadReviews, removeReview } from '../actions/reviewActions';
import { setSingleSpot } from '../actions/spotActions';

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

        const review = await response.json();
        dispatch(addReview(review));

        // Fetch updated spot data
        const spotResponse = await csrfFetch(`/api/spots/${spotId}`);
        if (spotResponse.ok) {
            const updatedSpot = await spotResponse.json();
            dispatch(setSingleSpot(updatedSpot));
        }

        return review;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

export const deleteReview = (reviewId, spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete review');
        }

        dispatch(removeReview(reviewId));

        // Update spot data after deletion
        const updatedSpot = await csrfFetch(`/api/spots/${spotId}`);
        if (updatedSpot.ok) {
            const spot = await updatedSpot.json();
            dispatch(setSingleSpot(spot));
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting review:', error);
        throw error;
    }
};

export const fetchReviewsBySpotId = (spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        console.log('Fetched reviews data:', data); // Debug log
        
        // Make sure we're dispatching the Reviews array from the response
        dispatch(loadReviews(data.Reviews || []));
        
        return data.Reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        dispatch(loadReviews([])); // Dispatch empty array on error
        throw error;
    }
};
