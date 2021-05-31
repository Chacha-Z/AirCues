import React from 'react';
import {  } from '../store/actions';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Chart from '../views/timeline-chart';

class View extends React.PureComponent {
    componentDidMount(){
        var data = [{date: '2015-04-23', value: 93.24}, {date: '2015-04-29', value: 95.35}, {date: '2015-05-12', value: 98.84}
                ,{date: '2015-05-29', value: 99.92}
                ,{date: '2015-06-05', value: 99.8}
                ,{date: '2015-06-21', value: 99.47}
                ,{date: '2015-07-02', value: 100.39}
                ,{date: '2015-07-29', value: 100.4}
                ,{date: '2015-08-12', value: 100.81}
                ,{date: '2015-08-25', value: 100.81}]

        Chart.init(this.container, data, this.props.snaps);
    }

    componentDidUpdate(){
        Chart.update(this.props.snapIndex)
    }

    render(){
        return (
            <Card className='view view-timeline'>
            <div className='view-container' ref={ ref=> this.container = ref }>

            </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    snaps: state.snapTime,
    snapIndex: state.snapIndex
})

const mapDispatchToProps = (dispath) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(View);