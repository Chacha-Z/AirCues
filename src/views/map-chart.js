/* eslint-disable no-undef */

const Chart = (function(){
    var map = null;
    var heatmap = null;
    return {
        init: (container, heatData) => {
            var disCountry = new AMap.DistrictLayer.Country({
                SOC:'CHN',
                zIndex:10,
                depth:2,
                styles:{
                    'nation-stroke':'#22ffff',
                    'coastline-stroke':[0.85, 0.63, 0.94, 1],
                    'province-stroke':'white',
                    'city-stroke': 'rgba(255,255,255,0)',
                    'fill':'rgba(254,255,255,0.15)'
                }
            })

            map = new AMap.Map(container, {
                zooms: [0, 7],
                zoom: 4,
                center: [102.618687,37.790976],
                // showLabel: true,
                mapStyle: 'amap://styles/dark',
                // layers: [disCountry],
            });
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
                    max: 80
                });
            });
        },

        update: (heatData) => {
            heatmap.setDataSet({
                data: heatData,
                max: 80
            });
        }
    }
})();

export default Chart;