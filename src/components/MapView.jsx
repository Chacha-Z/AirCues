import React from 'react';
import { connect } from 'react-redux';
import { Card, Switch } from 'antd';
/* eslint-disable no-undef */
import HeatChart from '../views/map-chart';
import HexChart from '../views/hexbin-chart';
import ScatterChart from '../views/scatterpoint-chart';
import * as d3 from 'd3'
import axois from 'axios';

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

        // let host = 'http://180.76.154.189:5000';
        // let date = '20130102';

        // axois.get(`${host}/${'getDailyAQI' + '/' + date}`)
        //     .then(res => {
        //         console.log(res.data);
        //         let aqidata = res.data[date];

        //         HexChart.init(map, this.container, aqidata, this.props.dispatch);
        //     })


        // let aqidata = []
        // for (let i = 1; i <= 7; i++) {
        //     let str = './data/2013010' + i + '.json'
        //     if (i == 7) {
        //         d3.json(str).then((data) => {
        //             aqidata[i - 1] = data;
        //             console.log(i, aqidata)
        //         });
        //         break;
        //     } else {
        //         d3.json(str).then((data) => {
        //             aqidata[i - 1] = data;
        //             // console.log(i, aqidata)
        //         })
        //     }
        // }


        // d3.json('./data/20130101_6.json').then((data) => {
        d3.json('./data/20140424.json').then((data) => {
            HexChart.init(map, this.container, data, this.props.dispatch);
            console.log(data)
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