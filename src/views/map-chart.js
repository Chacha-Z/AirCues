/* eslint-disable no-undef */
import * as d3 from 'd3'

const Chart = (function () {
    var heatmap = null;

    return {
        init: (map, heatData) => {
            var max = d3.max(heatData, d => d.count);

            var disCountry = new AMap.DistrictLayer.Country({
                SOC: 'CHN',
                zIndex: 10,
                depth: 2,
                styles: {
                    'nation-stroke': '#22ffff',
                    'coastline-stroke': [0.85, 0.63, 0.94, 1],
                    'province-stroke': 'white',
                    'city-stroke': 'rgba(255,255,255,0)',
                    'fill': 'rgba(254,255,255,0.15)'
                }
            })
            map.add(disCountry)

            map.plugin(["AMap.Heatmap"], function () {
                //初始化heatmap对象
                heatmap = new AMap.Heatmap(map, {
                    radius: 7, //给定半径
                    opacity: [0, 0.8],
                    gradient: {
                        0.1: 'rgba(50,48,118,1)',
                        0.2: 'rgba(127,60,255,1)',
                        0.4: 'rgba(166,53,219,1)',
                        0.6: 'rgba(254,64,95,1)',
                        0.8: 'rgba(255,98,4,1)',
                        1: 'rgba(236,220,79,1)',
                    },
                });
                heatmap.setDataSet({
                    data: heatData,
                    max: 100
                });
            });
        },

        update: (heatData) => {
            var max = d3.max(heatData, d => d.count);
            heatmap.setDataSet({
                data: heatData,
                max: 100
            });
        },

        hexagonSwitchChange(checked) {
            if (checked) {
                heatmap.hide();
            } else {
                heatmap.show();
            }
        }
    }
})();

export default Chart;