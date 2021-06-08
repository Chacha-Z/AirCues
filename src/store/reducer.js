import defaultState from './state';
import { TEST_ACTION1, NEXT_SNAP, SAVE_SNAP, CHOOSE_SNAP, CHOOSE_HEXBIN, GET_TIMELINE } from './actions';

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
        case CHOOSE_SNAP: {
            return {
                ...state,
                snapIndex: action.index
            }
        }
        case CHOOSE_HEXBIN: {
            return {
                ...state,
                choosedHexbin: state.choosedHexbin.length < 2? [...state.choosedHexbin, action.data] : [...state.choosedHexbin.slice(1, 2), action.data]
            }
        }
        case GET_TIMELINE: {
            return {
                ...state,
                timeLineData: action.data
            }
        }
        default:
            return state;
    }
}

export default reduers;