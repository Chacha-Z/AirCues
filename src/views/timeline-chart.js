import * as d3 from 'd3';
import { timeSpan, setHeatmap } from '../store/actions';
import axios from 'axios';

class Chart{
    margin = {top: 5, right: 15, bottom: 20, left: 30};
    config = {
        width: 500,
        height: 100
    }
    parseDate = d3.timeParse('%Y-%m-%d');
    parseSnapsDate = d3.timeParse('%Y%m%d');

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

    snaps = [];

    init(container, data, snaps, dispatch){
        this.snaps = snaps;
        data.forEach(element => {
            element.date = this.parseDate(element.date);
        });
        snaps = snaps.map(element => {
            return this.parseSnapsDate(element);
        });
        this.config.width = container.clientWidth;
        this.config.height = container.clientHeight;

        this.brush
            .extent([[this.margin.left, 0], [this.config.width - this.margin.right, this.config.height-this.margin.bottom]])
            .on('end', (event)=>{
                let selection = event.selection;
                if(selection == null){
                  return ;
                }
                let dateRange = selection.map(this.x.invert, this.x);

                let dateFormat = d3.timeFormat("%Y%m%d"); 

                let begin = dateFormat(dateRange[0]);
                let end = dateFormat(dateRange[1]);
                dispatch(timeSpan([begin, end]))
                
                let host = 'http://180.76.154.189:5000';
                
                axios.get(`${host}/${'getClusterCenter/'+begin+'-'+end}`)
                    .then(res => {
                        dispatch(setHeatmap(res.data))
                    })
            })
        this.x.domain(d3.extent(data, d => d.date))
            .range([this.margin.left, this.config.width - this.margin.right])
        this.y.domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]).nice()
            .range([this.config.height - this.margin.bottom, this.margin.top])
        this.yAxis = g => g
                    .attr("transform", `translate(${this.margin.left},0)`)
                    .call(d3.axisLeft(this.y).ticks(2))
                    .call(g => g.select(".domain").remove())
        this.xAxis = g => g
                .attr("transform", `translate(0,${this.config.height - this.margin.bottom})`)
                .call(d3.axisBottom(this.x).ticks(this.config.width / 80).tickSizeOuter(0))
                .call(g => g.select(".domain").remove())

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
                .selectAll('path.snaptick')
                .data(snaps)
                .enter()
                .append('path')
                .attr('d', this.symbol)
                .attr('class', 'snaptick')
                .attr("transform", d => {
                  return `translate(${this.x(d)}, ${this.config.height - this.margin.bottom + this.symbolSize/10})`;
                })
                .attr('fill', (d, i) => i==0?'black': 'none')
                .attr('opacity',0.4)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
        this.svg.append('g')
                .attr('class', 'timeline-brush')
                .call(this.brush);
    }

    update(index, snaps){
        d3.selectAll('path.snaptick')
            .attr('fill', (d, i) => i == index?'black': 'none')    
        if(snaps != this.snaps){
            this.snaps = snaps;
            snaps = snaps.map(element => {
                return this.parseSnapsDate(element);
            });
            d3.select('g.timeline-snapticks').remove();
            this.svg.append('g')
                .attr('class', 'timeline-snapticks')
                .selectAll('path.snaptick')
                .data(snaps)
                .enter()
                .append('path')
                .attr('d', this.symbol)
                .attr('class', 'snaptick')
                .attr("transform", d => {
                  return `translate(${this.x(d)}, ${this.config.height - this.margin.bottom + this.symbolSize/10})`;
                })
                .attr('fill', (d, i) => i==0?'black': 'none')
                .attr('opacity',0.4)
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
        }
        
    }
        
}

export default new Chart();