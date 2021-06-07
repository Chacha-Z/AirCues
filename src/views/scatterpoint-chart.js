import * as d3 from 'd3';

/* eslint-disable no-undef */
class Chart {
    data = [
        {"lnglat":[116.486409,39.561489],"cluster":"1"},
        {"lnglat":[116.286968,39.863642],"cluster":"1"},
        {"lnglat":[116.195445,39.914601],"cluster":"2"},
        {"lnglat":[116.310316,39.956074],"cluster":"2"},
        {"lnglat":[116.105381,39.937183],"cluster":"0"},
        // ...
    ];

    color = ['red', 'blue', 'yellow']
    container = null;
    map = null;
    svg = null;
    customLayer = null;

    init(map, container) {
        this.map = map;
        this.container = container;
        var width = this.container.clientWidth;
        var height = this.container.clientHeight;

        // 创建一个自定义图层
        this.svg = d3
            .create("svg")
            .attr('id', 'scattersvg')
            .attr("width", width)
            .attr("height", height)

        map.on("complete", ()=>{

            this.customLayer  = new AMap.CustomLayer(this.svg.node(), {
                zIndex: 100,
                zooms: [3, 18] // 设置可见级别，[最小级别，最大级别]
            });
            
            this.customLayer.render = this.onRender.bind(this);
            map.add(this.customLayer)
            this.customLayer.hide();
        });

    }

    onRender() {        
        this.dataProcess(this.data);

        this.svg
            .selectAll('circle')
            .data(this.data)
            .join(
                enter => enter
                    .append('circle')
                    .attr('cx', d=>d.lngY)
                    .attr('cy', d=>d.latX)
                    .attr('r', 10)
                    .attr('fill', d=>this.color[d.cluster]),
                update => update
                    .attr('cx', d=>d.lngY)
                    .attr('cy', d=>d.latX),
                exit => exit.remove()
            )
    }

    dataProcess(data){
        data.forEach(d => {
            let lnglat = new AMap.LngLat(d.lnglat[0], d.lnglat[1]); //给定的经纬度创建一个地理坐标
            let pixl = this.map.lngLatToContainer(lnglat); //返回地图图层上与地理坐标相一致的点
            d.latX = pixl.y;
            d.lngY = pixl.x;
        });
    }

    scatterSwitchChange(checked) {
        if (checked) {
            this.customLayer.show();
        } else {
            this.customLayer.hide();
        }
    }
}

export default new Chart();