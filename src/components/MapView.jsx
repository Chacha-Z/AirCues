import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Chart from '../views/map-chart';

import './view-comp-style.less';

class View extends React.PureComponent {
    componentDidMount(){
        Chart.init(this.container, this.props.heatMapData[this.props.snapIndex]);

    }

    componentDidUpdate(prevProps, prevState){
        Chart.update(this.props.heatMapData[this.props.snapIndex])
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
})
export default connect(mapStateToProps, mapDispatchToProps)(View);