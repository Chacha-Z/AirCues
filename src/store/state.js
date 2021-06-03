import data from '../views/data/clusterOutput.json'
import data2 from '../views/data/aqiOutput.json'
export default {
    test: 'origintest',
    snapTime: data.snaps,
    heatMapData: [data2],
    snapIndex: 0,
    snapSrc: []
}