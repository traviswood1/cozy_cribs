import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import spotsReducer from './spots';
import spotImagesReducer from './spotImages';
import spotReviewsReducer from './spotReviews';

// Error handling middleware
const errorMiddleware = store => next => action => {
  try {
    if (action instanceof Promise) {
      return action.catch(error => {
        console.error('Redux Promise Error:', error);
        throw error;
      });
    }
    return next(action);
  } catch (error) {
    console.error('Redux Error:', error);
    throw error;
  }
};

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  spotImages: spotImagesReducer,
  spotReviews: spotReviewsReducer,
});

// Add Redux DevTools in development
const enhancer = process.env.NODE_ENV === 'production'
  ? applyMiddleware(thunk, errorMiddleware)
  : compose(
      applyMiddleware(thunk, errorMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__ 
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
    );

const configureStore = (preloadedState) => {
  const store = createStore(rootReducer, preloadedState, enhancer);

  // Enable hot reloading in development
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept(rootReducer, () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
};

export default configureStore;
