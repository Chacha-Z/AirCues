import data from '../views/data/initHeatmapData.json'
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
    timeSpan:[],
    scatterData: {'maxId':5057, "data":[{"cluster":2063,"lnglat":[109.25,18.34]}]}
}