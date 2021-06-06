import './App.less';
import MapView from './components/MapView';
import TimeLine from './components/TimeLine';
import SnapShoot from './components/SnapShoot';
import CompareView from './components/CompareView';
import View4 from './components/View4';

function App() {
  return (
    <div className="App">
        <div className='view-main'>
          <TimeLine></TimeLine>
          <MapView></MapView>
          <SnapShoot></SnapShoot>
        </div>
        <CompareView></CompareView>
        <View4></View4>
    </div>
  );
}

export default App;
