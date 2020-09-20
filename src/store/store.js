import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { boardReducer } from './reducers/boardReducer'
import { userReducer } from './reducers/userReducer'
import { systemReducer } from './reducers/systemReducer'


const mainReducer = combineReducers({
    userReducer,
    boardReducer,
    systemReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(mainReducer, composeEnhancers(applyMiddleware(thunk)))