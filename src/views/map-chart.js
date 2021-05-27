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
                zoom: 3.50,
                center: [102.618687,37.790976],
                // showLabel: true,
                mapStyle: 'amap://styles/dark',
                // layers: [disCountry],
            });
            
            map.add(disCountry)
            map.plugin(["AMap.Heatmap"], function () {
                //初始化heatmap对象
                heatmap = new AMap.Heatmap(map, {
                    radius: 3, //给定半径
                    opacity: [0, 0.8],   
                    gradient: {
                        0.1: '#2A85B8',
                        0.2: '#16B0A9',
                        0.3: '#29CF6F',
                        0.4: '#5CE182',
                        0.5: '#7DF675',
                        0.6: '#FFF100',
                        0.7: '#FAA53F',
                        1: '#D04343',
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