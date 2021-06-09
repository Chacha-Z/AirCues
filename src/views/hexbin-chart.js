import * as d3 from 'd3';
import * as d3hexbin from "d3-hexbin";
import { chooseHexbin, getPOI } from '../store/actions';

import axois from 'axios';
/* eslint-disable no-undef */
class Chart {
    aqidata = [];

    width = 0;
    height = 0;
    nowzoom = 0;
    radius = 100;

    container = null;
    map = null;
    svg = null;
    customLayer = null;
    geocoder = null;

    hexitem = null;
    largehexitem = null;
    smallhexitem = null;


    init(map, container, aqidata, dispatch) {
        this.map = map;
        this.aqidata = aqidata;
        this.container = container;

        // let host = 'http://180.76.154.189:5000';
        // let date = '20130102';

        // axois.get(`${host}/${'getDailyAQI' + '/' + date}`)
        //     .then(res => {
        //         //console.log(res.data);
        //         console.log("2" + res.data[date]);
        //         this.aqidata = res.data[date];
        //         //HexChart.init(map, this.container, res.data[date], this.props.dispatch);
        //     })

        this.svg = this.drawhexbin(dispatch);
        // 创建一个自定义图层
        console.log(this.svg)
        this.customLayer = new AMap.CustomLayer(this.svg.node(), {
            zIndex: 100,
            zooms: [3, 18] // 设置可见级别，[最小级别，最大级别]
        });

        map.add(this.customLayer);
        this.customLayer.hide();

        map.on('moveend', () => {
            this.svg = this.drawhexbin(dispatch);
            d3.select('#hexsvg').remove();
            if (d3.select('.amap-e').node() != null) {
                d3.select('.amap-e').node().appendChild(this.svg.node());
            }
        });

        map.on('zoomend', () => {
            this.svg = this.drawhexbin(dispatch);
            d3.select('#hexsvg').remove();
            if (d3.select('.amap-e').node() != null) {
                d3.select('.amap-e').node().appendChild(this.svg.node());
            }
        })
    }

    // 绘制蜂窝图层
    drawhexbin = (dispatch) => {
        console.log('in draw')
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
        this.radius = 650 * 2 ** (this.nowzoom - 10);

        //生成大小六边形
        let large_hex = this.radius_vertex(this.radius);
        let small_hex = this.radius_vertex(this.radius * 0.8);

        // let aqi_bins = this.dataProcess(this.aqidata); 

        // let aqi_bins = []

        // for (let i = 0; i < 6; i++) { //绑定数据 6天
        //     aqi_bins[i] = this.dataProcess(this.aqidata[i]);
        // }

        let aqi_bins = this.dataProcess(this.aqidata); //包含六天的
        console.log(aqi_bins)

        console.log('after dataprocess')
        //颜色映射
        let red_color = d3
            .scaleSequential(d3.interpolate("white", "#FF4500"))
            .domain([0, d3.max(aqi_bins, (d) => d.aqi_avg)]); //红色代表当天
        let blue_color = d3
            .scaleSequential(d3.interpolate("white", "steelblue"))
            .domain([0, d3.max(aqi_bins, (d) => d.aqi_avg)]); //蓝色也代表当天的

        this.hexitem = this.svg
            .append("g")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.1)
            .selectAll("path")
            .data(aqi_bins) // [0]
            .enter();



        // 外层六边形
        let largehexitem = this.hexitem
            .append("path")
            .attr("d", this.vertex_path(large_hex))
            .attr("transform", (d) => `translate(${d.x},${d.y})`)
            .attr("fill", function (d) {
                return blue_color(d.aqi_avg);
            })
            .attr("opacity", 0.85);
        console.log('after draw large hex')
        // 内部六边形
        if (this.nowzoom <= 4) {
            this.hexbinlevel1(red_color, small_hex, this.hexitem);
        } else if (this.nowzoom <= 5) {
            this.hexbinlevel2(red_color, small_hex, this.hexitem);
        } else {
            this.hexbinlevel3(aqi_bins, this.hexitem);
        }
        //透明图层，for交互
        let chipath = this.hexitem
            .append("path")
            .attr("d", this.vertex_path(large_hex))
            .attr("transform", (d) => `translate(${d.x},${d.y})`)
            .attr("fill", 'blue')
            .attr("opacity", 0);

        chipath
            .style('cursor', 'pointer')
            .on('click', (e) => {

                // 根据坐标获取中心点经纬度
                var pixel = new AMap.Pixel(e.target.__data__.x, e.target.__data__.y);
                var lnglat = this.map.containerToLngLat(pixel);
                console.log(lnglat)
                console.log(e.target.__data__);
                d3.select(e.target)
                    .attr("opacity", 0.5)
                    .classed('hexbin-clicked', true)

                // 保存当前点击六边形原始数据，用于对比视图
                dispatch(chooseHexbin(e.target.__data__))

                var host = 'http://180.76.154.189:5000';

                axois.get(`${host}/${'getPOI' + '/' + lnglat.lng + '/' + lnglat.lat}`)
                    .then(res => {
                        dispatch(getPOI(res.data.POIData))
                    })
            })
        return this.svg;
    }

    hexbinlevel1(red_color, small_hex, hexitem) {
        //缩放Level 1 （整个六边形）
        hexitem
            .append("path")
            .attr("d", this.vertex_path(small_hex))
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
    }
    hexbinlevel2(red_color, small_hex, hexitem) {//缩放Level 2 （六块三角形）
        let vertex = small_hex;
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
            hexitem
                .append("path")
                .attr("d", tripath)
                .attr(
                    "transform",
                    (d) =>
                        `translate(${d.x + this.wind_move(d.avg_U, d.avg_V)[0]},${d.y + this.wind_move(d.avg_U, d.avg_V)[1]
                        })`
                ) //从原点移过来
                .attr("fill", function (d) {
                    return red_color(d.aqi_avg6[i]); // 需要一个六个的数组， 画小三角的颜色
                })
                .attr("opacity", 0.85);
        }
    }

    getCol = (arr, i) => {
        let col = [];
        let x; // 每一行
        for (x of arr) {
            col.push(x[i])
        }
        return col;
    }

    hexbinlevel3(aqi_bins, hexitem) {  // 六层三角形
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
            //let eachaqi = this.getCol(aqi_bins.aqi_avg6_d6, i)
            aqi_color.push(
                d3
                    .scaleSequential(d3.interpolate("white", e))
                    // .domain([0, d3.max(aqi_bins, (d) => this.getCol(d.aqi_avg6_d6))]) // 根据最大的确定
                    .domain([0, d3.max(aqi_bins, (d) => d.aqi_avg)])
                //  d3.max(this.getCol(d.aqi_avg6_d6, i)))
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
            for (let j = 0; j < 6; j++) { //j = 6
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
                hexitem
                    .append("path")
                    .attr("d", tripath)
                    .attr('id', j)
                    .attr("transform", (d) => `translate(${d.x},${d.y})`)
                    //.attr("stroke", "white")
                    .attr("fill", function (d) {
                        // console.log(d.aqi_avg6_d6[j][i]);
                        //console.log(aqi_color[i](d.aqi_avg6_d6[j][i]));
                        return aqi_color[j](d.aqi_avg6_d6[i][j]); //颜色 改改改
                        //return aqi_color[j](d.aqi_avg6[i]);
                    });
            }
        }
    }
    data_to_hexbin = (data) => {
        data.forEach((d) => {
            let lnglat = new AMap.LngLat(d.lon, d.lat); //给定的经纬度创建一个地理坐标
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
        // console.log('hexbin arr:  ',bins); 
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
        let aqi_avg6_d6 = [[], [], [], [], [], []];
        let aqi_bins = [];
        // 绑定一天的真实数据
        for (let i = 0; i < 6; i++) {
            aqi_bins.push(this.data_to_hexbin(aqidata[i]));

            //统计六方向数据 （ -> 整体六种值
            aqi_bins[i].forEach((d) => { //d是六边形中的多个结点
                //console.log(d);
                let aqi_sum = new Array(6).fill(0); // [0,0,0,0,0,0]
                let AQI_SUM = 0;
                let wind_U = 0, wind_V = 0;

                // 计算这整个六边形中的各种气体因子浓度和。（之后可能是计算均值/污染级别）
                d.forEach((i) => {
                    //console.log(i);
                    AQI_SUM += i['AQI'];
                    aqi_sum[0] += i['PM2.5_IAQI'];
                    aqi_sum[1] += i['PM10_IAQI'];
                    aqi_sum[2] += i['SO2_IAQI'];
                    aqi_sum[3] += i['NO2_IAQI'];
                    aqi_sum[4] += i['CO_IAQI']; // 应该是1000， 效果
                    aqi_sum[5] += i['O3_IAQI'];
                    wind_U += i['U'];
                    wind_V += i['V'];
                });

                //console.log(d.length);
                let aqi_avg6 = aqi_sum.map(item => {
                    return item / d.length;
                });
                d.aqi_avg6 = aqi_avg6;
                d.aqi_avg = AQI_SUM / d.length; // /d.length

                d.avg_U = wind_U / d.length; //风速求平均
                d.avg_V = wind_V / d.length;

                aqi_avg6_d6[i].push(aqi_avg6); //存后六天的数据
            });
            //console.log(aqidata)
        }
        for (let i = 0; i < aqi_avg6_d6[0].length; ++i) {
            aqi_bins[0][i].aqi_avg6_d6 = []
            for (let j = 0; j < 6; ++j) {
                aqi_bins[0][i].aqi_avg6_d6.push(aqi_avg6_d6[j][i]);
            }
        }
        return aqi_bins[0] // 可以只返回第一天的，已经有后六天的数据了
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