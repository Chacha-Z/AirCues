import React from 'react';
import { connect } from 'react-redux';
import { Card, Switch } from 'antd';
/* eslint-disable no-undef */
import Chart from '../views/map-chart';
import HexChart from '../views/hexbin-chart';
import * as d3 from 'd3'

import './view-comp-style.less';

class View extends React.PureComponent {
    map = null;

    componentDidMount() {
        this.map = new AMap.Map(this.container, {
            zooms: [0, 15],
            zoom: 4,
            center: [102.618687, 37.790976],
            mapStyle: 'amap://styles/dark',
        });
        Chart.init(this.map, this.props.heatMapData[this.props.snapIndex]);
        
        d3.csv("./CSVdata/hexCSV.csv").then((data)=>{
            HexChart.init(this.map, this.container, data);
        })
    
    }
    componentDidUpdate(prevProps, prevState) {
        Chart.update(this.props.heatMapData[this.props.snapIndex])
    }
    render() {
        return (
            <Card className='view view-map'>
                <div className='view-container' ref={ref => this.container = ref} id='map'>

                </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    heatMapData: state.heatMapData,
    snapIndex: state.snapIndex,
    snapSrc: state.snapSrc
})

const mapDispatchToProps = (dispath) => ({
})
export default connect(mapStateToProps, mapDispatchToProps)(View);