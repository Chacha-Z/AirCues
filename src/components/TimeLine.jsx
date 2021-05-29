import React from 'react';
import {  } from '../store/actions';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Chart from '../views/timeline-chart';

class View extends React.PureComponent {
    componentDidMount(){
        var data = [{date: '2007-04-23', value: 93.24}, {date: '2007-04-24', value: 95.35}, {date: '2007-04-25', value: 98.84}
                ,{date: '2007-04-26', value: 99.92}
                ,{date: '2007-04-29', value: 99.8}
                ,{date: '2007-05-01', value: 99.47}
                ,{date: '2007-05-02', value: 100.39}
                ,{date: '2007-05-03', value: 100.4}
                ,{date: '2007-05-04', value: 100.81}
                ,{date: '2007-05-07', value: 100.81}]
        var snap = [{start: '2007-04-23', end: '2007-04-27'}, 
                {start: '2007-04-27', end: '2007-05-01'},
                {start: '2007-05-03', end: '2007-05-06'}
            ]
        Chart.init(this.container, data, snap);
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

})

const mapDispatchToProps = (dispath) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(View);