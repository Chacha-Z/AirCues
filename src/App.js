import './App.less';
import MapView from './components/MapView';
import ContrlView from './components/ContrlView';
import View3 from './components/View3';
import View4 from './components/View4';
import View5 from './components/View5';

function App() {
  return (
    <div className="App">
        <ContrlView></ContrlView>
        <MapView></MapView>
        <View3></View3>
        <View4></View4>
        <View5></View5>
    </div>
  );
}

export default App;
