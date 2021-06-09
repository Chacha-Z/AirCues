import './App.less';
import MapView from './components/MapView';
import TimeLine from './components/TimeLine';
import SnapShoot from './components/SnapShoot';
import CompareView from './components/CompareView';
import StreamLine from './components/StreamLine';

function App() {
  
  return (
    <div className="App">
        <div className='view-main'>
          <TimeLine></TimeLine>
          <MapView></MapView>
          <SnapShoot></SnapShoot>
        </div>
        <CompareView></CompareView>
        <StreamLine></StreamLine>
    </div>
  );
}

export default App;
