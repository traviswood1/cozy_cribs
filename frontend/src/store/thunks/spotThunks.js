import { csrfFetch } from '../csrf';
import { 
    setSingleSpot, 
    addSpot, 
    loadSpots, 
    removeSpot, 
    updateSpotAction 
} from '../actions/spotActions';

// Thunks
export const deleteSpot = (spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete spot');
        }

        dispatch(removeSpot(spotId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting spot:', error);
        throw error;
    }
};

export const createSpot = (spotData) => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/spots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spotData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }

        const newSpot = await response.json();

        // Handle image uploads
        if (spotData.images && spotData.images.length > 0) {
            for (let i = 0; i < spotData.images.length; i++) {
                const imageData = {
                    url: spotData.images[i],
                    preview: i === 0 // First image is preview
                };

                await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(imageData)
                });
            }
        }

        // Fetch the complete spot data with images
        const completeSpotResponse = await csrfFetch(`/api/spots/${newSpot.id}`);
        const completeSpot = await completeSpotResponse.json();

        dispatch(addSpot(completeSpot));
        return completeSpot;
    } catch (error) {
        console.error('Error creating spot:', error);
        throw error;
    }
};

export const fetchSpots = () => async (dispatch) => {
    try {
        const response = await csrfFetch('/api/spots');
        if (!response.ok) throw new Error('Failed to fetch spots');
        const spots = await response.json();
        dispatch(loadSpots(spots.Spots || spots));
        return spots;
    } catch (error) {
        console.error('Error fetching spots:', error);
        throw error;
    }
};

export const fetchSpotById = (spotId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`);
        if (!response.ok) throw new Error('Failed to fetch spot');
        const spot = await response.json();
        dispatch(setSingleSpot(spot));
        return spot;
    } catch (error) {
        console.error('Error fetching spot:', error);
        throw error;
    }
};

export const updateSpot = (spotId, spotData) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spotData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }


        // Handle image uploads if there are new images
        if (spotData.images && spotData.images.length > 0) {
            for (let i = 0; i < spotData.images.length; i++) {
                if (spotData.images[i].startsWith('http')) continue;

                const imageData = {
                    url: spotData.images[i],
                    preview: i === 0
                };

                await csrfFetch(`/api/spots/${spotId}/images`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(imageData)
                });
            }
        }

        // Fetch the complete updated spot with images
        const completeSpotResponse = await csrfFetch(`/api/spots/${spotId}`);
        const completeSpot = await completeSpotResponse.json();

        dispatch(updateSpotAction(completeSpot));
        dispatch(setSingleSpot(completeSpot));
        return completeSpot;
    } catch (error) {
        console.error('Error updating spot:', error);
        throw error;
    }
};
