import { useEffect } from 'react'
import './App.css';
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3001');

function App() {
  useEffect(() => {
    console.log("yep");
    socket.emit('test_connect');
  }, []);

  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;
