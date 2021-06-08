import * as d3 from 'd3';

class Chart {
    margin = { top: 20, right: 10, bottom: 10, left: 10, middel_left: 0, middel_right: 0 };
    width = 500;
    height = 100;
    middle_width = 50;

    legend = ['居住用地', '公共管理与公共服务设施用地', '商业服务业设施用地', '工业用地', '道路与交通设施用地', '绿地与广场用地']
    x_right = d3.scaleLinear()
    x_left = d3.scaleLinear()
    y = d3.scaleBand()
        .domain(this.legend)
        .padding(0.2)

    xAxis_right = null;
    xAxis_left = null;

    svg = null;

    init(container, data) {
        this.width = container.clientWidth;
        this.height = container.clientHeight - 250;
        this.margin.middel_left = this.width / 2 + this.margin.left - this.middle_width
        this.margin.middel_right = this.width / 2 + this.margin.left + this.middle_width

        this.x_left
            .range([this.margin.middel_left, this.margin.left])
            .domain([0, d3.max(data, d => d3.max(d, item => item.value))])
        this.x_right
            .range([this.margin.middel_right, this.width - this.margin.right])
            .domain([0, d3.max(data, d => d3.max(d, item => item.value))])
        this.y.range([this.margin.top + 10, this.height - this.margin.bottom])

        this.xAxis_right = g => g
            .attr("transform", `translate(0,${this.margin.top})`)
            .call(d3.axisTop(this.x_right).ticks(this.width / 80))
            .call(g => g.select(".domain").remove())

        this.xAxis_left = g => g
            .attr("transform", `translate(0,${this.margin.top})`)
            .call(d3.axisTop(this.x_left).ticks(this.width / 80))
            .call(g => g.select(".domain").remove())


        this.svg = d3.select(container).append('svg')
            .attr('width', this.width)
            .attr('height', this.height)

        this.svg.selectAll('g.type')
            .data(this.legend)
            .join('g')
            .attr('transform', d => `translate(${this.margin.middel_left + this.middle_width}, ${this.y(d) + this.y.bandwidth() / 2})`)
            .selectAll('text')
            .data(d => d.length > 7 ? [d.slice(0, 7), d.slice(7, d.length)] : [d])
            .join('text')
            .text(d => d)
            .attr('dy', (d, i) => i * 20)
            .attr('class', 'type')
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', 'middle')

        this.svg.append("g")
            .attr('class', 'xaxis')
            .call(this.xAxis_right);
        this.svg.append("g")
            .attr('class', 'xaxis')
            .call(this.xAxis_left);
    }

    update(data) {
        this.x_left
            .domain([0, d3.max(data, d => d3.max(d, item => item.value))])
        this.x_right
            .domain([0, d3.max(data, d => d3.max(d, item => item.value))])
        d3.selectAll('g.xaxis').remove();
        this.xAxis_right = g => g
            .attr("transform", `translate(0,${this.margin.top})`)
            .call(d3.axisTop(this.x_right).ticks(4))
            .call(g => g.select(".domain").remove())

        this.xAxis_left = g => g
            .attr("transform", `translate(0,${this.margin.top})`)
            .call(d3.axisTop(this.x_left).ticks(4))
            .call(g => g.select(".domain").remove())

        this.svg.append("g")
            .attr('class', 'xaxis')
            .call(this.xAxis_right);
        this.svg.append("g")
            .attr('class', 'xaxis')
            .call(this.xAxis_left);

        this.svg.selectAll("g.bars")
            .data(data)
            .join('g')
            .attr('class', 'bars')
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data((d, i) => d.map(item => {
                return {
                    side: i,
                    type: item.type,
                    value: item.value
                }
            }))
            .join("rect")
            .attr('class', 'POIRect')
            .attr("x", d => d.side == 0 ? this.x_left(d.value) : this.x_right(0))
            .attr("y", d => this.y(d.type))
            .attr("width", d => d.side == 0 ? this.x_left(0) - this.x_left(d.value) : this.x_right(d.value) - this.x_right(0))
            .attr("height", this.y.bandwidth())
            .on('mouseover', function(event, d){
                console.log(event)

                d3.select(this)
                    .style('cursor', 'pointer')
                    .classed('mouseon', true)
                
                //鼠标悬浮框
                d3.select('#bartooltip').transition()
                        .duration(100)
                        .style('display', 'block')
    
                d3.select('#bartooltip').html(d.type + ': '+d.value)
                    .style('left', (event.layerX)+'px')
                    .style('top', (event.layerY+250)+'px')
    
            })
            .on("mouseout", function(d) {	
                d3.select(this)
                    .classed('mouseon', false)
            
                    d3.select('#bartooltip').transition()		
                        .duration(200)
                        .style('display', 'none')
            })
    }
}

export default new Chart();