import data from '../views/data/clusterOutput(1).json'

export default {
    test: 'origintest',
    snapTime: data.snaps,
    heatMapData: data.heatMapData,
    snapIndex: 0,
    snapSrc: [],
    choosedHexbin: [],
    timeLineData: [{date: '2018-01-01', value: 93.24}
                    ,{date: '2018-01-29', value: 95.35}
                    ,{date: '2018-02-12', value: 98.84}
                    ,{date: '2018-02-29', value: 99.92}
                    ,{date: '2018-03-05', value: 99.8}
                    ,{date: '2018-03-21', value: 99.47}
                    ,{date: '2018-04-02', value: 100.39}
                    ,{date: '2018-04-29', value: 100.4}
                    ,{date: '2018-05-12', value: 100.81}
                    ,{date: '2018-06-25', value: 100.81}],
    
}