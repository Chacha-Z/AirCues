import Http from './http';

const http = new Http();

export const TEST_ACTION1 = 'TEST_ACTION1'

export const testAction1 = arg1 => {
    return {
        type: 'TEST_ACTION1',
        actionarg: arg1
    }
}