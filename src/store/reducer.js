import defaultState from './state';
import { TEST_ACTION1, NEXT_SNAP, SAVE_SNAP } from './actions';

const reduers = (state = defaultState, action) => {
    switch(action.type){
        case TEST_ACTION1:{
            return {
                ...state,
                test: action.actionarg
            }
        }
        case NEXT_SNAP: {
            return {
                ...state,
                snapIndex: (state.snapIndex+1)%(state.heatMapData.length)
            }
        }
        case SAVE_SNAP: {
            return {
                ...state,
                snapSrc: [...state.snapSrc, action.src]
            }
        }
        default:
            return state;
    }
}

export default reduers;