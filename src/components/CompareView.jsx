import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import HexChart from '../views/compare-hexbin';
import BarChart from '../views/compare-bar';

class View extends React.PureComponent {
    componentDidMount(){
        HexChart.init(this.container, this.props.choosedHexbin)
        BarChart.init(this.container, this.props.comparePOI, this.tooltip)
    }

    componentDidUpdate(){
        HexChart.update(this.props.choosedHexbin)
        BarChart.update(this.props.comparePOI)
    }

    render(){
        const { value, onButtonClick } = this.props;
        return (
            <Card className='view view-compare' title="CompareView">
            <div className='view-container' ref={ref => this.container = ref} >

            </div>
            <div id='bartooltip' className='tooltip' style={{display: 'none'}} ></div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    choosedHexbin: state.choosedHexbin,
    comparePOI: state.comparePOI
})

const mapDispatchToProps = (dispath) => ({
    
})
export default connect(mapStateToProps, mapDispatchToProps)(View);