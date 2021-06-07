import * as d3 from 'd3';
import * as d3hexbin from "d3-hexbin";

class Chart{
    margin = {top: 5, right: 15, bottom: 20, left: 30};
    widt = 500
    height = 500

    blue_color = null;

    svg = null;
    hexitem = null;

    init(container, data){
        this.width = container.clientWidth;
        this.height = 250;

        this.blue_color = d3
            .scaleSequential(d3.interpolate("white", "steelblue"))
            .domain([0, 5000]);

        this.svg = d3.select(container)
            .append('svg')
            .attr('id', 'hexbinc-svg')
            .attr('width', this.width)
            .attr('height', this.height)            
    }

    update(data){
        console.log('update:', data)
        d3.selectAll('path.compare-hexbin').remove();
        let radius = this.height/2;

        //生成大小六边形
        let large_hex = this.radius_vertex(radius);
        let small_hex = this.radius_vertex(radius * 0.8);
        
        let update = this.svg
            .selectAll("path")
            .data(data)
        let enter = update.enter()
        let exit = update.exit();
        enter
            .append("path")
            .attr('class', 'compare-hexbin')
            .attr("d", this.vertex_path(large_hex))
            .attr("transform", (d, i) => `translate(${i*radius*2+radius+radius/2},${radius})`)
            .attr("fill", (d) => {
                return this.blue_color(d.aqi_avg);
            })
            .attr("opacity", 0.85)

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
                    .domain([0, 15000])
            );
        });

        // 生成层次hex 的定点
        let aqi_vertex = [];
        let s = 0;
        for (let i = 1; i <= 7; i++) {
            // s += (6-i)**2;
            aqi_vertex.push(this.radius_vertex(radius * 0.8 * (i / 6) ** 0.5));
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
                enter
                    .append("path")
                    .attr('class', 'compare-hexbin')
                    .attr("d", tripath)
                    .attr("transform", (d, i) => `translate(${i*radius*2+radius+radius/2},${radius})`)
                    .attr("fill", function (d) {
                        return aqi_color[j](d.aqi_sum[i]);
                    });
            }
        }
    }

    vertex_path = (arr) => {
        let s = "M";
        arr.forEach((i) => {
            s = s + (i[0] + "," + i[1] + "L");
        });
        s = s.slice(0, -1) + "Z";
        return s;
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
}

export default new Chart();