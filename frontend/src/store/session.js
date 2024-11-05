import { csrfFetch } from './csrf';

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const SET_LOADING = "session/setLoading";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password
      })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };

export const login = (user) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password
      })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE'
    });
    dispatch(removeUser());
    return response;
  };

export const restoreUser = () => async dispatch => {
  dispatch(setLoading(true));
  try {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } catch (error) {
    console.error('Failed to restore user:', error);
    dispatch(setUser(null));
  } finally {
    dispatch(setLoading(false));
  }
};

const initialState = { 
  user: null,
  isLoading: true // Start with loading true
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { 
        ...state, 
        user: action.payload,
      };
    case REMOVE_USER:
      return { 
        ...state, 
        user: null 
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export default sessionReducer;