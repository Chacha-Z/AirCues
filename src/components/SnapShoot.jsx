import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { chooseSnap } from '../store/actions';
import { setScatter } from '../store/actions';
import axios from 'axios';

class View extends React.PureComponent {

    host = 'http://180.76.154.189:5000';
    render(){
        const { snapSrc } = this.props
        const imgsItems = snapSrc.map((item, index) =>
            <img className="snapshoot-img" 
                style={{border: (index===this.props.snapIndex) ? "#fff solid 0.5px" : "#777 dashed 0.5px"}}
                src={item} 
                alt='snapshoot' 
                key={index} 
                onClick={(e)=>{
                    this.props.choosSnap(e, index)
                    console.log('on snap click')
                    axios.get(`${this.host}/${'getClusterIdx/'+this.props.snapTime[index]}`)
                        .then(res => {
                            console.log(res)
                            this.props.dispatch(setScatter(res.data))
                        })
                }}></img>
        );
        return (
            <Card className='view view-snapshoot'>
                <div className='view-container' id='snapshoot-container'>
                    {imgsItems}
                </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    snapSrc: state.snapSrc,
    snapIndex: state.snapIndex,
    snapTime: state.snapTime
})

const mapDispatchToProps = (dispatch) => ({
    choosSnap: (e, index)=> dispatch(chooseSnap(index)),
    dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(View);