import defaultState from './state';
import { TEST_ACTION1, NEXT_SNAP, SAVE_SNAP, CHOOSE_SNAP, CHOOSE_HEXBIN, GET_POI, TIME_SPAN, SET_SCATTER, SET_HEATMAP } from './actions';

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
        case GET_POI: {
            let res = state.comparePOI.length < 2? [...state.comparePOI, action.data] : [...state.comparePOI.slice(1, 2), action.data]
            return {
                ...state,
                comparePOI: res
            }
        }
        case TIME_SPAN: {
            console.log('in time span:', action.data)
            return {
                ...state,
                timeSpan: action.data
            }
        }
        case SET_SCATTER: {
            console.log('in SET_SCATTER:', action.data)
            return {
                ...state,
                scatterData: action.data
            }
        }
        case SET_HEATMAP: {
            console.log('in SET_HEATMAP:', action)
            return {
                ...state,
                heatMapData: action.heatMapData,
                snapTime: action.snaps,
                snapIndex: 0,
                snapSrc: [],
            }
        }
        default:
            return state;
    }
}

export default reduers;