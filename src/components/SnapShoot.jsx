import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { chooseSnap } from '../store/actions';

class View extends React.PureComponent {

    render(){
        const { snapSrc } = this.props
        const imgsItems = snapSrc.map((item, index) =>
            <img className="snapshoot-img" 
                style={{border: (index===this.props.snapIndex) ? "#fff solid 0.5px" : "#777 dashed 0.5px"}}
                src={item} 
                alt='snapshoot' 
                key={index} 
                onClick={(e)=>this.props.choosSnap(e, index)}></img>
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
})

const mapDispatchToProps = (dispath) => ({
    choosSnap: (e, index)=> dispath(chooseSnap(index))
})
export default connect(mapStateToProps, mapDispatchToProps)(View);