import logo from './img/logo.png';
import './css/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-input-container">
          <input type="text" className="App-input" placeholder="Enter a URL or drop a file here to get started..."/>
          <button className="App-input-button">Git shuckin'</button>
        </div>
        <div>
          <a className="App-footer" href="https://github.com/sjb-ch1mp" target="_blank">github.com/sjb-ch1mp</a>
        </div>
      </header>
    </div>
  );
}

export default App;
