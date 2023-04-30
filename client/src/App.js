import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route exact path='game/:roomId' element={<Game/>} />
      </Routes>
    </div>
  );
}

export default App;
