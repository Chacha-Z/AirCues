import * as d3 from 'd3';

class Chart{
    margin = {top: 5, right: 15, bottom: 20, left: 30};
    config = {
        width: 500,
        height: 100
    }
    parseDate = d3.timeParse('%Y-%m-%d');

    x = d3.scaleUtc()
    y = d3.scaleLinear()
    xAxis = null;
    yAxis = null;

    symbolSize = 60;
    symbol = d3.symbol().type(d3.symbolTriangle).size(this.symbolSize);
    line = d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => this.x(d.date))
            .y(d => this.y(d.value));
    brush = d3.brushX();

    svg = null;

    init(container, data, snaps){
        data.forEach(element => {
            element.date = this.parseDate(element.date);
        });
        snaps.forEach(element => {
            element.start = this.parseDate(element.start);
            element.end = this.parseDate(element.end);
        });

        this.config.width = container.clientWidth;
        this.config.height = container.clientHeight;

        this.brush
            .extent([[this.margin.left, 0], [this.config.width - this.margin.right, this.config.height]])
            .on('end', ()=>{
                console.log('brush end')
            })
        this.x.domain(d3.extent(data, d => d.date))
            .range([this.margin.left, this.config.width - this.margin.right])
        this.y.domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]).nice()
            .range([this.config.height - this.margin.bottom, this.margin.top])  
        this.yAxis = g => g
                    .attr("transform", `translate(${this.margin.left},0)`)
                    .call(d3.axisLeft(this.y).ticks(this.config.height / 80))
                    .call(g => g.select(".domain").remove())
        this.xAxis = g => g
                .attr("transform", `translate(0,${this.config.height - this.margin.bottom})`)
                .call(d3.axisBottom(this.x).ticks(this.config.width / 80).tickSizeOuter(0))

        this.svg = d3.select(container)
                .append('svg')
                .attr('width', this.config.width)
                .attr('height', this.config.height)

        this.svg.append('g').call(this.xAxis);
        this.svg.append('g').call(this.yAxis);

        this.svg.append('path')
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", this.line);

        this.svg.append('g')
                .attr('class', 'timeline-snapticks')
                .selectAll('rect.snaptick')
                .data(snaps)
                .enter()
                .append('path')
                .attr('d', this.symbol)
                .attr('class', 'snaptick')
                .attr("transform", d => {
                  return `translate(${this.x(d.start)}, ${this.config.height - this.margin.bottom + this.symbolSize/10})`;
                })
                .attr('fill','none')
                .attr('opacity',0.4)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
        this.svg.append('g')
                .attr('class', 'timeline-brush')
                .call(this.brush);
    }

    update(){
        
    }
}

export default new Chart();