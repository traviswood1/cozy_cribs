import { csrfFetch } from '../csrf';

export const fetchSpotData = async (spotId) => {
    try {
        const response = await csrfFetch(`/api/spots/${spotId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch spot: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching spot data:', error);
        throw error;
    }
}; 