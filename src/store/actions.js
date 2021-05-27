import Http from './http';

const http = new Http();

export const TEST_ACTION1 = 'TEST_ACTION1'
export const NEXT_SNAP = 'NEXT_SNAP'
export const SAVE_SNAP = 'SAVE_SNAP'

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