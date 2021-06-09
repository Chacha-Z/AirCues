import React from 'react';
import { testAction1 } from '../store/actions';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Chart from '../views/stream-chart';
import axios from 'axios'
import * as d3 from 'd3'


class Test extends React.PureComponent {

    data = [];
    parseDate = d3.timeFormat('%Y-%m-%d');

    componentDidMount(){
        // axios.get("http://180.76.154.189:5000/getBinData")
        //         .then(res=>{
        //     this.data = res.data.binData
        //     console.log(this.data)
        //     Chart.init(this.container, this.data);
        // })
        console.log(this.props.stream)
        Chart.init(this.container, this.props.stream);  

    }

    componentDidUpdate(){
        // console.log(this.props.stream)
        let start =  this.props.stream.findIndex(element => this.parseDate(element["date"]) === this.props.timeSpan[0])
        let end = this.props.stream.findIndex(element => this.parseDate(element["date"]) === this.props.timeSpan[1])
        // let newdata = this.props.stream.slice(start, end);
        // console.log(this.newdata)
        // console.log(start,end)
        console.log(this.props.stream.slice(start,end))
        Chart.update(this.container, this.props.stream.slice(start,end))
    }

    render(){
        return (
            <Card className='view view-name4' title="stream view">
            <div className='view-container' ref={ ref=> this.container = ref }>
            </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    timeSpan: state.timeSpan,
    stream:state.stream
})

const mapDispatchToProps = (dispath) => ({
    onButtonClick: () => {
        console.log('click test');
        dispath(testAction1('testdispatchdata'));
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(Test);