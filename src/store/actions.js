export const TEST_ACTION1 = 'TEST_ACTION1'
export const NEXT_SNAP = 'NEXT_SNAP'
export const SAVE_SNAP = 'SAVE_SNAP'
export const CHOOSE_SNAP = 'CHOOSE_SNAP'
export const CHOOSE_HEXBIN = 'CHOOSE_HEXBIN'
export const GET_POI = 'GET_POI'
export const TIME_SPAN = 'TIME_SPAN'


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
export const getPOI = data => {
    console.log('in getPOI action: ', data)  
    return {
        type: GET_POI,
        // [{ type: "居住用地", value: 50 }, { type: "公共管理与公共服务设施用地", value: 32 }, { type: "商业服务业设施用地", value: 14 }, { type: "工业用地", value: 14 }, { type: "道路与交通设施用地", value: 14 }, { type: "绿地与广场用地", value: 14 }]
        data: data
    }
}

export const timeSpan = data => { 
    return {
        type: TIME_SPAN,
        // [{ type: "居住用地", value: 50 }, { type: "公共管理与公共服务设施用地", value: 32 }, { type: "商业服务业设施用地", value: 14 }, { type: "工业用地", value: 14 }, { type: "道路与交通设施用地", value: 14 }, { type: "绿地与广场用地", value: 14 }]
        data: data
    }
}