import data from '../views/data/clusterOutput(1).json'
import timeline from '../views/data/getTimeLine.json'

export default {
    test: 'origintest',
    snapTime: data.snaps,
    heatMapData: data.heatMapData,
    snapIndex: 0,
    snapSrc: [],
    choosedHexbin: [],
    timeLineData: timeline.timelineData,
    comparePOI: [],
    timeSpan:[]
}