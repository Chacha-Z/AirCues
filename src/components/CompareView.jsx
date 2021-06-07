import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import HexChart from '../views/compare-hexbin';
import BarChart from '../views/compare-bar';

class View extends React.PureComponent {
    componentDidMount(){
        HexChart.init(this.container, this.props.choosedHexbin)
        BarChart.init(this.container)
    }

    componentDidUpdate(){
        HexChart.update(this.props.choosedHexbin)
    }

    render(){
        const { value, onButtonClick } = this.props;
        return (
            <Card className='view view-compare' title="CompareView">
            <div className='view-container' ref={ref => this.container = ref} >

            </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    choosedHexbin: state.choosedHexbin
})

const mapDispatchToProps = (dispath) => ({
    
})
export default connect(mapStateToProps, mapDispatchToProps)(View);