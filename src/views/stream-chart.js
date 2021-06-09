import * as d3 from 'd3';

class Chart{
    margin = {top: 5, right: 15, bottom: 20, left: 30};
    config = {
        width: 500,
        height: 100
    }
    parseDate = d3.timeParse('%Y%m%d');
    topics = ['2','3','4','5','6'];
    ColorMap = d3.scaleOrdinal()
                        .domain(this.topics)
                        .range(['#ffff24', '#fc8705','#dd3700','#732e7e', '#700000'])
    stack = d3.stack().keys(this.topics).offset(d3.stackOffsetWiggle);
    

    x = d3.scaleUtc()
    y = d3.scaleLinear()
    xAxis = null;
    yAxis = null;
    

    area = d3.area()
            .x((d) => this.x(d.data.date))
            .y0((d) => this.y(d[0]))
            .y1((d) => this.y(d[1]))
            .curve(d3.curveBasis);
    svg = null;

    init(container, data){
        let newdata = data
        data.forEach(element => {
           return (element.date = this.parseDate(element.date));
        });
        this.config.width = container.clientWidth;
        this.config.height = container.clientHeight;
        this.series = this.stack(data)

        this.x.domain(d3.extent(data, d => d.date))
            .range([this.margin.left, this.config.width - this.margin.right])
        this.y.domain([d3.min(this.series,this.stackMin), d3.max(this.series, this.stackMax)]).nice()
            .range([this.config.height - this.margin.bottom, this.margin.top])  
        // this.yAxis = g => g
        //             .attr("transform", `translate(${this.margin.left},0)`)
        //             .call(d3.axisLeft(this.y).ticks(2))
        //             .call(g => g.select(".domain").remove())
        this.xAxis = g => g
                .attr("transform", `translate(0,${this.config.height - this.margin.bottom})`)
                .call(d3.axisBottom(this.x).ticks(this.config.width / 80).tickSizeOuter(0))
                .call(g => g.select(".domain").remove())

        this.svg = d3.select(container)
                .append('svg')
                .attr('width', this.config.width)
                .attr('height', this.config.height)


        this.svg.append('g').call(this.xAxis);
        // this.svg.append('g').call(this.yAxis);
      this.svg
        .selectAll('path')
        .data(this.series)
        .enter()
        .append('path')
        .attr('d', this.area)
        .attr('topic', (val,index)=> this.topics[index])
        .attr('click', false)
        .attr('fill', (d,i) => `${this.ColorMap(this.topics[i])}`)
        .attr('opacity','0.8')
    }

    update(container, data){
        this.svg.remove();
        console.log(data)
        this.config.width = container.clientWidth;
        this.config.height = container.clientHeight;
        this.series = this.stack(data)
        this.x.domain(d3.extent(data, d => d.date))
            .range([this.margin.left, this.config.width - this.margin.right])
        this.y.domain([d3.min(this.series,this.stackMin), d3.max(this.series, this.stackMax)]).nice()
            .range([this.config.height - this.margin.bottom, this.margin.top])  
        this.xAxis = g => g
                .attr("transform", `translate(0,${this.config.height - this.margin.bottom})`)
                .call(d3.axisBottom(this.x).ticks(this.config.width / 80).tickSizeOuter(0))
                .call(g => g.select(".domain").remove())
        this.svg = d3.select(container)
                .append('svg')
                .attr('width', this.config.width)
                .attr('height', this.config.height)

        this.svg.append('g').call(this.xAxis);
        this.svg
            .selectAll('path')
            .data(this.series)
            .enter()
            .append('path')
            .attr('d', this.area)
            .attr('topic', (val,index)=> this.topics[index])
            .attr('click', false)
            .attr('fill', (d,i) => `${this.ColorMap(this.topics[i])}`)
            .attr('opacity','0.8')
    }

      // 获取堆栈数据矩阵的最大值
    stackMax(layer) {
        return d3.max(layer, (d) => d[1]);
      }
    
      // 获取堆栈数据矩阵的最小值
    stackMin(layer) {
        return d3.min(layer, (d) => d[0]);
      }
}

export default new Chart();