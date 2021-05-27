import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';

class View extends React.PureComponent {

    render(){
        const { snapSrc } = this.props
        const imgsItems = snapSrc.map((item, index) =>
            <img className="snapshoot-img" src={item} alt='snapshoot' key={index}></img>
        );
        return (
            <Card className='view view-snapshoot' title="snapshoot">
                <div className='view-container' id='snapshoot-container'>
                    {imgsItems}
                </div>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    snapSrc: state.snapSrc
})

const mapDispatchToProps = (dispath) => ({

})
export default connect(mapStateToProps, mapDispatchToProps)(View);