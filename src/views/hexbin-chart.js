import * as d3 from 'd3';
import * as d3hexbin from "d3-hexbin";
/* eslint-disable no-undef */
class Chart {
    aqidata = [];

    width = 0;
    height = 0;
    nowzoom = 0;
    radius = 1000;

    container = null;
    map = null;
    svg = null;
    customLayer = null;

    hexitem = null;
    largehexitem = null;
    smallhexitem = null;
    large_hex = null;
    small_hex = null;
    
    init(map, container, aqidata) {
        this.map = map;
        this.aqidata = aqidata;
        this.container = container;

        map.on("complete", ()=>{
            this.svg = this.drawhexbin();
            // 创建一个自定义图层
            this.customLayer  = new AMap.CustomLayer(this.svg.node(), {
                zIndex: 100,
                zooms: [3, 18] // 设置可见级别，[最小级别，最大级别]
            });
    
            map.add(this.customLayer);
            this.customLayer.hide();
        });

        map.on('moveend', ()=>{
            this.svg = this.drawhexbin();
            d3.select('#hexsvg').remove();
            console.log(d3.select('.amap-e'))
            d3.select('.amap-e').node().appendChild(this.svg.node());
            console.log('moveend')
        })
        map.on('zoomend', ()=>{
            this.svg = this.drawhexbin();
            d3.select('#hexsvg').remove();
            console.log(d3.select('.amap-e'))
            d3.select('.amap-e').node().appendChild(this.svg.node());
            console.log('zoomend')
        })
    }

    // 绘制蜂窝图层
    drawhexbin = () => {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.svg = d3 //构建svg画布
            .create("svg")
            .attr('id', 'hexsvg')
            .style("width", +this.width + "px")
            .style("height", +this.height + "px")
        this.svg.append("g")
            .attr("transform", "translate(" + 0 + "," + 0 + ")");

        this.nowzoom = this.map.getZoom();
        this.radius = 1000 * 2 ** (this.nowzoom - 10);

        //生成大小六边形
        this.large_hex = this.radius_vertex(this.radius);
        this.small_hex = this.radius_vertex(this.radius * 0.8);

        let aqi_bins = this.dataProcess(this.aqidata);
        // console.log("aqi_bins:  ", aqi_bins);

        //颜色映射
        let red_color = d3
            .scaleSequential(d3.interpolate("white", "#FF4500"))
            .domain([0, d3.max(aqi_bins, (d) => d.aqi_avg)]);
        let blue_color = d3
            .scaleSequential(d3.interpolate("white", "steelblue"))
            .domain([0, d3.max(aqi_bins, (d) => d.aqi_avg)]);

        this.hexitem = this.svg
            .append("g")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.1)
            .selectAll("path")
            .data(aqi_bins)
            .enter();

        // 外层六边形
        this.largehexitem = this.hexitem
            .append("path")
            .attr("d", this.vertex_path(this.large_hex))
            .attr("transform", (d) => `translate(${d.x},${d.y})`)
            .attr("fill", function (d) {
                return blue_color(d.aqi_avg);
            })
            .attr("opacity", 0.85);

        // 内部六边形
        if (this.nowzoom <= 5) {
            //缩放Level 1 （整个六边形）
            this.smallhexitem = this.hexitem
                .append("path")
                .attr("d", this.vertex_path(this.small_hex))
                .attr(
                    "transform",
                    (d) =>
                        `translate(${d.x + this.wind_move(d.avg_U, d.avg_V)[0]},${d.y + this.wind_move(d.avg_U, d.avg_V)[1]
                        })`
                )
                .attr("fill", function (d) {
                    return red_color(d.aqi_avg);
                })
                .attr("opacity", 0.9);
        } else if (this.nowzoom <= 7) {
            //缩放Level 2 （六块三角形）
            let vertex = this.small_hex;
            for (let i = 0; i < vertex.length; i++) {
                //length是6
                let j = (i + 1) % vertex.length;
                let tripath =
                    "M0,0L" +
                    vertex[i][0] +
                    "," +
                    vertex[i][1] +
                    "L" +
                    vertex[j][0] +
                    "," +
                    vertex[j][1] +
                    "Z";
                this.hexitem
                    .append("path")
                    .attr("d", tripath)
                    .attr(
                        "transform",
                        (d) =>
                            `translate(${d.x + this.wind_move(d.avg_U, d.avg_V)[0]},${d.y + this.wind_move(d.avg_U, d.avg_V)[1]
                            })`
                    ) //从原点移过来
                    .attr("fill", function (d) {
                        return red_color(d.aqi_sum[i]); // 需要一个六个的数组， 画小三角的颜色
                    })
                    .attr("opacity", 0.85);
            }
        } else {
            //缩放Level 3 三角区分层
            let itemcolor = [
                "MediumPurple",
                "PaleVioletRed",
                "OliveDrab",
                "Coral",
                "DodgerBlue",
                "Gold",
            ];

            let aqi_color = []; //存放6个颜色比例尺
            itemcolor.forEach((e, i) => {
                aqi_color.push(
                    d3
                        .scaleSequential(d3.interpolate("white", e))
                        .domain([0, d3.max(aqi_bins, (d) => d.aqi_sum[i])])
                );
            });

            // 生成层次hex 的定点
            let aqi_vertex = [];
            let s = 0;
            for (let i = 1; i <= 7; i++) {
                // s += (6-i)**2;
                aqi_vertex.push(this.radius_vertex(this.radius * 0.8 * (i / 6) ** 0.5));
            }
            // console.log("aqi_vertex:", aqi_vertex);

            for (let i = 5; i >= 0; i--) {
                // 六瓣三角形
                for (let j = 0; j < 6; j++) {
                    // 七层
                    let k = (j + 1) % 6; // k不就是i+1吗？ 6的时候不是
                    let tripath =
                        "M0,0L" +
                        aqi_vertex[i][j][0] +
                        "," +
                        aqi_vertex[i][j][1] +
                        "L" +
                        aqi_vertex[i][k][0] +
                        "," +
                        aqi_vertex[i][k][1] +
                        "Z";
                    this.hexitem
                        .append("path")
                        .attr("d", tripath)
                        .attr("transform", (d) => `translate(${d.x},${d.y})`)
                        .attr("fill", function (d) {
                            return aqi_color[j](d.aqi_sum[i]);
                        });
                }
            }
        }
        return this.svg;
    }
    
    data_to_hexbin = (data) => {
        data.forEach((d) => {
            let lnglat = new AMap.LngLat(d.lng, d.lat); //给定的经纬度创建一个地理坐标
            let pixl = this.map.lngLatToContainer(lnglat); //返回地图图层上与地理坐标相一致的点
            d.latX = pixl.y;
            d.lngY = pixl.x;
        });
        // console.log('lnglat data: ', data)
        let hexbin = d3hexbin
            .hexbin() //六边形构造器
            .x((d) => d.lngY)
            .y((d) => d.latX)
            .radius(this.radius)
            .extent([this.width, this.height]);

        let bins = hexbin(data); //生成数组
        // console.log('hexbin arr:  ',bins); //待解决问题，生成的像素有负值，应该是地图图层transform右上角！！！！！
        return bins;
    }
    //生成顶点
    radius_vertex = (r) => {
        let vertex = [];
        let v = [0, r];
        let cosx = Math.cos(Math.PI / 3);
        let sinx = Math.sin(Math.PI / 3);
        for (let i = 0; i < 6; i++) {
            vertex.push(v);
            v = [cosx * v[0] + sinx * v[1], -sinx * v[0] + cosx * v[1]];
        }
        return vertex;
    }
    
    // 风向偏移函数
    wind_move = (u, v) => {
        let x, y; //偏移量
        let a = 0.2 * this.radius;
        let b = 0.1 * Math.sqrt(3) * this.radius;
        let c = 0.1 * this.radius;
        if (u > 0 && v == 0) {
            x = b;
            y = 0;
        } else if (u > 0 && v > 0) {
            x = b;
            y = c;
        } else if (u == 0 && v > 0) {
            x = 0;
            y = a;
        } else if (u < 0 && v > 0) {
            x = -b;
            y = c;
        } else if (u < 0 && v == 0) {
            x = -b;
            y = 0;
        } else if (u < 0 && v < 0) {
            x = -b;
            y = -c;
        } else if (u == 0 && v < 0) {
            x = 0;
            y = -a;
        } else {
            // u>0 v<0
            x = b;
            y = -c;
        }
        return [x, y];
    }
    
    vertex_path = (arr) => {
        let s = "M";
        arr.forEach((i) => {
            s = s + (i[0] + "," + i[1] + "L");
        });
        s = s.slice(0, -1) + "Z";
        return s;
    }

    dataProcess = (aqidata) => {
        // 绑定真实数据
        let aqi_bins = this.data_to_hexbin(aqidata);

        // 求AQI， 暂时用均值
        function avg(array) {
            let len = array.length;
            let sum = 0;
            for (let i = 0; i < len; i++) {
                sum += array[i];
            }
            return sum / len;
        }

        //统计六方向数据 （ -> 整体六种值
        aqi_bins.forEach((d) => {
            //console.log(d);
            let aqi_sum = new Array(6).fill(0); // [0,0,0,0,0,0]
            let wind_U, wind_V;

            // 计算这整个六边形中的各种气体因子浓度和。（之后可能是计算均值/污染级别）
            d.forEach((i) => {
                //console.log(i);
                aqi_sum[0] += Number(i.PM2_5);
                aqi_sum[1] += Number(i.PM10);
                aqi_sum[2] += Number(i.SO2);
                aqi_sum[3] += Number(i.NO2);
                aqi_sum[4] += Number(i.CO * 100); // 应该是1000， 效果
                aqi_sum[5] += Number(i.O3);
                wind_U += Number(i.U);
                wind_V += Number(i.V);
            });
            //console.log(d.length);
            d.aqi_sum = aqi_sum;
            d.aqi_avg = avg(aqi_sum); // /d.length

            d.avg_U = wind_U / d.length; //风速求平均
            d.avg_V = wind_V / d.length;
        });

        return aqi_bins
    }
    
    hexagonSwitchChange(checked) {
        if (checked) {
            this.customLayer.show();
        } else {
            this.customLayer.hide();
        }
    }
}


export default new Chart();