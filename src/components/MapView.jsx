import React from 'react';
import { connect } from 'react-redux';
import { Card, Switch } from 'antd';
import Chart from '../views/map-chart';

import './view-comp-style.less';

class View extends React.PureComponent {
    componentDidMount() {
        Chart.init(this.container, this.props.heatMapData[this.props.snapIndex]);

    }

    componentDidUpdate(prevProps, prevState) {
        Chart.update(this.props.heatMapData[this.props.snapIndex])
    }

    //图片下载操作,指定图片类型
    download(canvas, type) {
        //设置保存图片的类型
        var imgdata = canvas.toDataURL(type);
        this.props.saveSnap(imgdata);
    }

    hexagonSwitchChange(checked) {
        Chart.hexagonSwitchChange(checked);  //写在map-chart.js里面
    }

    render() {
        return (
            <Card className='view view-map' extra={
                <div>
                    <Switch
                        checkedChildren="Hexagon on"
                        unCheckedChildren="Hexagon off"
                        onChange={checked => this.hexagonSwitchChange(checked)}
                    />
                </div>
            }>
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
})
export default connect(mapStateToProps, mapDispatchToProps)(View);