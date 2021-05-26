import { createStore, applyMiddleware} from 'redux';
import reducers from './reducer';
import thunk from 'redux-thunk';

let store = createStore(reducers, applyMiddleware(thunk));

export default store;