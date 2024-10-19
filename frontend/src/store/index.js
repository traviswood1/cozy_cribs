import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import spotsReducer from './spots';
import spotImagesReducer from './spotImages';
import spotReviewsReducer from './spotReviews';

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  spotImages: spotImagesReducer,
  spotReviews: spotReviewsReducer,
});

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, applyMiddleware(thunk));
};

export default configureStore;
