import { SocketContext, socket } from './context/SocketContext'
import Home from './pages/Home'

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <Home/>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
