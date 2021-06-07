import React from 'react';
import { nextSnap, saveSnap } from '../store/actions';
import { connect } from 'react-redux';
import { Card, Switch, Radio } from 'antd';
import Chart from '../views/timeline-chart';
import MapChart from '../views/map-chart';
import HexbinChart from '../views/hexbin-chart';
import ScatterChart from '../views/scatterpoint-chart';
import * as html2canvas from 'html2canvas';

class View extends React.PureComponent {

    data = [{date: '2018-01-01', value: 93.24}
        ,{date: '2018-01-29', value: 95.35}
        ,{date: '2018-02-12', value: 98.84}
        ,{date: '2018-02-29', value: 99.92}
        ,{date: '2018-03-05', value: 99.8}
        ,{date: '2018-03-21', value: 99.47}
        ,{date: '2018-04-02', value: 100.39}
        ,{date: '2018-04-29', value: 100.4}
        ,{date: '2018-05-12', value: 100.81}
        ,{date: '2018-06-25', value: 100.81}];

    clickI = null;

    componentDidMount(){
        Chart.init(this.container, this.data, this.props.snaps);
        
        this.clickI = setInterval(()=>{
            this.snapsPlay();
        }, 2000)
    }

    componentDidUpdate(){
        Chart.update(this.props.snapIndex)
    }

    animSwitchChange(checked){
        if(!checked){
            clearInterval(this.clickI)
        }else{

            this.clickI = setInterval(()=>{
                this.snapsPlay();
            }, 2000)
        }
    }

    snapsPlay(){
        if(this.props.snapSrc.length < this.props.heatMapData.length){
            html2canvas(document.getElementsByClassName('heatmap-canvas')[0], {
                foreignObjectRendering: true,
                useCORS: true,
                x: window.pageXOffset,  //页面在水平方向的滚动距离
                y: window.pageYOffset,  //页面在垂直方向的滚动距离
                backgroundColor: null   //无背景
            }).then((canvas) => {
                this.download(canvas, 'png')
            });
        }
        this.props.nextSnap();
    }

    //图片下载操作,指定图片类型
    download(canvas, type) {
        //设置保存图片的类型
        var imgdata = canvas.toDataURL(type);
        this.props.saveSnap(imgdata);
    }
    
    onLayerChange(e) {
        let value = e.target.value
        let checked = e.target.checked
        switch (value) {
            case 'heatmap':
                MapChart.mapSwitchChange(checked);
                HexbinChart.hexagonSwitchChange(!checked);  
                ScatterChart.scatterSwitchChange(!checked);  
                break;
            case 'hexbin':
                HexbinChart.hexagonSwitchChange(checked);  
                ScatterChart.scatterSwitchChange(!checked);
                MapChart.mapSwitchChange(!checked);
                break;
            case 'scatter':
                ScatterChart.scatterSwitchChange(checked);  
                MapChart.mapSwitchChange(!checked); 
                HexbinChart.hexagonSwitchChange(!checked); 
                break;
            default:
                break;
        }

        if(value != 'heatmap' && this.playBut.innerText == 'ON'){
            const mouseEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            this.playBut.dispatchEvent(mouseEvent)
        }
    }

    render(){
        return (
            <Card className='view view-timeline' title="test block" extra={
                <div>
                    <span className="func-span">Layer: </span>
                    <Radio.Group onChange={this.onLayerChange.bind(this)} defaultValue="heatmap" size="small">
                        <Radio.Button value="heatmap" >Heatmap</Radio.Button>
                        <Radio.Button value="hexbin" >Hexbin</Radio.Button>
                        <Radio.Button value="scatter" >Scatter</Radio.Button>
                    </Radio.Group>
                    <Switch className='ctrlBut' ref={ ref=> this.playBut = ref }
                        checkedChildren="ON" 
                        unCheckedChildren="OFF" defaultChecked 
                        size="small"
                        onChange={checked => this.animSwitchChange(checked)}
                    />
                </div>
            }>
            <div className='view-container' ref={ ref=> this.container = ref }>

            </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    snaps: state.snapTime,
    snapIndex: state.snapIndex,
    heatMapData: state.heatMapData,
    snapSrc: state.snapSrc
})

const mapDispatchToProps = (dispath) => ({
    saveSnap: (src) => {
        dispath(saveSnap(src))
    },
    nextSnap: () => {
        dispath(nextSnap())
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(View);