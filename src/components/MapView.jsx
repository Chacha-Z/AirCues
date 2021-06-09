import React from 'react';
import { connect } from 'react-redux';
import { Card, Switch } from 'antd';
/* eslint-disable no-undef */
import HeatChart from '../views/map-chart';
import HexChart from '../views/hexbin-chart';
import ScatterChart from '../views/scatterpoint-chart';
import * as d3 from 'd3'

import './view-comp-style.less';

class View extends React.PureComponent {
    componentDidMount() {
        var map = new AMap.Map(this.container, {
            zooms: [0, 15],
            zoom: 4,
            center: [102.618687, 37.790976],
            mapStyle: 'amap://styles/dark',
        });
        HeatChart.init(map, this.props.heatMapData[this.props.snapIndex]);
        
        d3.csv("./CSVdata/hexCSV.csv").then((data)=>{
            HexChart.init(map, this.container, data, this.props.dispatch);
        })
        ScatterChart.init(map, this.container, this.props.scatterData)
    }

    componentDidUpdate(prevProps, prevState) {
        HeatChart.update(this.props.heatMapData, this.props.snapIndex)
        ScatterChart.update(this.props.scatterData)
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
    snapSrc: state.snapSrc,
    scatterData: state.scatterData
})

const mapDispatchToProps = (dispatch) => ({
    dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(View);