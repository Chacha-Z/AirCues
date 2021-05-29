import React from 'react';
import { nextSnap, saveSnap } from '../store/actions';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Chart from '../views/map-chart';
import * as html2canvas from 'html2canvas'

import './view-comp-style.less';

class View extends React.PureComponent {
    componentDidMount(){
        Chart.init(this.container, this.props.heatMapData[this.props.snapIndex]);

        setInterval(()=>{
            if(this.props.snapSrc.length < this.props.heatMapData.length){
                html2canvas(document.getElementsByClassName('heatmap-canvas')[0], {
                    foreignObjectRendering: true,
                    useCORS: true,
                    x: window.pageXOffset, //页面在水平方向的滚动距离
                    y: window.pageYOffset,//页面在垂直方向的滚动距离
                    backgroundColor: null//无背景
                }).then((canvas) => {
                    this.download(canvas, 'png')
                });
            }
            this.props.nextSnap();
        }, 2000)
    }

    componentDidUpdate(prevProps, prevState){
        Chart.update(this.props.heatMapData[this.props.snapIndex])
    }

    //图片下载操作,指定图片类型
    download(canvas, type) {
        //设置保存图片的类型
        var imgdata = canvas.toDataURL(type);
        this.props.saveSnap(imgdata);
    }
    render(){
        return (
            <Card className='view view-map'>
                <div className='view-container' ref={ref => this.container = ref}>
                    
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
    nextSnap: () => {
        dispath(nextSnap())
    },
    saveSnap: (src) => {
        dispath(saveSnap(src))
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(View);