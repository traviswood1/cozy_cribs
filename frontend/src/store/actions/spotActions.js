import * as types from '../actionTypes';

export const setSingleSpot = (spot) => ({
    type: types.SET_SINGLE_SPOT,
    payload: spot
});

export const addSpot = (spot) => ({
    type: types.ADD_SPOT,
    payload: spot
});

export const loadSpots = (spots) => ({
    type: types.LOAD_SPOTS,
    payload: spots
});

export const removeSpot = (spotId) => ({
    type: types.REMOVE_SPOT,
    payload: spotId
});

export const updateSpotAction = (spot) => ({
    type: types.UPDATE_SPOT,
    payload: spot
}); 