import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import spotsReducer from './reducers/spotsReducer';
import spotImagesReducer from './spotImages';
import spotReviewsReducer from './spotReviews';

const rootReducer = combineReducers({
    session: sessionReducer,
    spots: spotsReducer,
    spotImages: spotImagesReducer,
    spotReviews: spotReviewsReducer,
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;

// Re-export everything from our modules
export * from './actions/spotActions';
export * from './actions/reviewActions';
export * from './thunks/spotThunks';
export * from './thunks/reviewThunks';
export * from './selectors/spotSelectors';
