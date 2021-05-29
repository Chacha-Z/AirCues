import './App.less';
import MapView from './components/MapView';
import TimeLine from './components/TimeLine';
import SnapShoot from './components/SnapShoot';
import View3 from './components/View3';
import View4 from './components/View4';

function App() {
  return (
    <div className="App">
        <div className='view-main'>
          <TimeLine></TimeLine>
          <MapView></MapView>
          <SnapShoot></SnapShoot>
        </div>
        <View3></View3>
        <View4></View4>
    </div>
  );
}

export default App;
