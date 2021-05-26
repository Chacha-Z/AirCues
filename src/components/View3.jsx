import React from 'react';
import { testAction1 } from '../store/actions';
import { connect } from 'react-redux';
import { Card } from 'antd';

class View extends React.PureComponent {

    render(){
        const { value, onButtonClick } = this.props;
        return (
            <Card className='view view-name3' title="test block">
            <div className='container'>
                <span>state.test = {value}</span>
                <button onClick={onButtonClick}>click me </button>
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
export default connect(mapStateToProps, mapDispatchToProps)(View);