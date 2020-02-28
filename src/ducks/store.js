import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import User from './User'
let reducers = combineReducers({
    User
});

export default createStore(reducers, composeWithDevTools());
