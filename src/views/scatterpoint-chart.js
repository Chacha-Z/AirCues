import * as d3 from 'd3';

/* eslint-disable no-undef */
class Chart {
    data = [];
    maxCluster = 0;
    color = ['red', 'blue', 'yellow']
    container = null;
    map = null;
    svg = null;
    customLayer = null;
    //颜色插值器 
    colorScale = d3.scaleLinear() 
                .range(["blue","yellow"]) 

    init(map, container, data) {
        
        this.data = data.data;
        this.maxCluster = data.maxId;
        this.map = map;
        this.container = container;
        var width = this.container.clientWidth;
        var height = this.container.clientHeight;

        this.colorScale
            .domain([0,this.maxCluster]) 

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
    update(data){
        this.data = data.data;
        this.maxCluster = data.maxId;
        this.colorScale
            .domain([0,this.maxCluster]) 
        this.onRender();
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
                    .attr('r', 1)
                    .attr('fill', d=>this.colorScale(d.cluster)),
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