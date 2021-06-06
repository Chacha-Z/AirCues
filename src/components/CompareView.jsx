import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Chart from '../views/compare-hexbin';

class View extends React.PureComponent {
    componentDidMount(){
        Chart.init(this.container, this.props.choosedHexbin)
    }

    componentDidUpdate(){
        Chart.update(this.props.choosedHexbin)
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