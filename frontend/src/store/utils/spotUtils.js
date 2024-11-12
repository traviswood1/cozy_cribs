import { csrfFetch } from '../csrf';

export const fetchSpotData = async (spotId) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`);
        if (response.ok) {
            const spot = await response.json();
            return spot;
        }
        throw new Error('Failed to fetch spot data');
    } catch (error) {
        console.error('Error in fetchSpotData:', error);
        throw error;
    }
}; 