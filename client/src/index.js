import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SocketContext, socket } from './context/SocketContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Commented out for development only
  //<React.StrictMode>
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
        <App />
      </SocketContext.Provider>
    </BrowserRouter>
  //</React.StrictMode>
);
