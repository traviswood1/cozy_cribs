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

const removeUser = () => ({
  type: REMOVE_USER,
  payload: null
});

const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const retryRequest = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.status === 502 || error.status === 503)) {
      console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

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
  return retryRequest(async () => {
    try {
      const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Login error (${response.status}):`, errorData);
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  });
};

export const logout = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    await response.json();
    dispatch(removeUser());
    
    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
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
        user: null,
        isLoading: false // Ensure loading is false after logout
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