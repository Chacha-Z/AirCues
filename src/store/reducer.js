import defaultState from './state';
import { TEST_ACTION1 } from './actions';

const reduers = (state = defaultState, action) => {
    switch(action.type){
        case TEST_ACTION1:{
            console.log('in reducer: test_action1', state);
            return {
                ...defaultState,
                test: action.actionarg
            }
        }
        default:
            return state;
    }
}

export default reduers;