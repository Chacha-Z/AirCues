import React from 'react';
import { testAction1 } from '../store/actions';
import { connect } from 'react-redux';
import { Card } from 'antd';
import Chart from '../views/stream-chart';
import axios from 'axios'


class Test extends React.PureComponent {

    data = [{date: '2018-01-01', '1': 93.24,'2':54,"3":67,"4":100,"5":13,"6":44},
            {date: '2018-01-02', '1': 12,'2':54,"3":67,"4":10,"5":13,"6":44},
            {date: '2018-01-03', '1': 93.24,'2':54,"3":67,"4":10,"5":56,"6":4},
            {date: '2018-01-04', '1': 45,'2':54,"3":67,"4":10,"5":13,"6":44},
            {date: '2018-01-05', '1': 93.24,'2':54,"3":67,"4":10,"5":13,"6":24},
            {date: '2018-01-06', '1': 123,'2':54,"3":67,"4":10,"5":73,"6":44},
            {date: '2018-01-07', '1': 66,'2':54,"3":67,"4":10,"5":13,"6":74}
    ];


    componentDidMount(){
        axios.get("http://180.76.154.189:5000/getBinData")
                .then(res=>{
            this.data = res.data.binData
            Chart.init(this.container, this.data);
        })
    }

    componentDidUpdate(){
        Chart.update(this.data)
    }

    render(){
        return (
            <Card className='view view-name4' title="test block4">
            <div className='view-container' ref={ ref=> this.container = ref }>
            </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    value: state.test,
})

const mapDispatchToProps = (dispath) => ({
    onButtonClick: () => {
        console.log('click test');
        dispath(testAction1('testdispatchdata'));
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(Test);