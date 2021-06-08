import Http from './http';

const http = new Http();

export const TEST_ACTION1 = 'TEST_ACTION1'
export const NEXT_SNAP = 'NEXT_SNAP'
export const SAVE_SNAP = 'SAVE_SNAP'
export const CHOOSE_SNAP = 'CHOOSE_SNAP'
export const CHOOSE_HEXBIN = 'CHOOSE_HEXBIN'
export const GET_TIMELINE = 'GET_TIMELINE'

export const testAction1 = arg1 => {
    return {
        type: TEST_ACTION1,
        actionarg: arg1
    }
}

export const nextSnap = () => {
    return {
        type: NEXT_SNAP,
    }
}

export const saveSnap = (src) => {
    return {
        type: SAVE_SNAP,
        src
    }
}

export const chooseSnap = (index) => {
    return {
        type: CHOOSE_SNAP,
        index
    }
}

export const chooseHexbin = (data) => {
    return {
        type: CHOOSE_HEXBIN,
        data
    }
}
export const getTimeLine = (data) => {
    return {
        type: GET_TIMELINE,
        data
    }
}
