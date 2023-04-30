import { useContext, useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'

function Home() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomNotFound, setRoomNotFound] = useState(false);

  const joinRoom = () => {
    if(nickname !== '' && roomId !== '') {
        setRoomNotFound(false);
        socket.emit('join_room', {nickname, roomId});
    }
  }

  const createRoom = () => {
    setRoomNotFound(false);
    socket.emit('create_room', {nickname});
  }

  const joinRandom = () => {
    setRoomNotFound(false);
    socket.emit('join_random', {nickname});
  }

  useEffect(() => {
    socket.on('room_not_found', (data) => {
      setRoomNotFound(true);
    });

    socket.on('join_success', (data) => {
      var {roomId} = data;
      navigate(`/game/${roomId}`);
    })
  }, [socket, navigate]);

  return (
    <div className="home-container">

      <input
        placeholder='Enter nickname...'
        value={nickname}
        onChange={(e) => {setNickname(e.target.value)}}
      />
      
      <input
        placeholder='Enter room ID...'
        value={roomId}
        onChange={(e) => {setRoomId(e.target.value)}}
      />

      {roomNotFound &&
      <p>Room not found!</p>}

      <br></br><button onClick={joinRoom}>Join Room</button>
      <br></br><button onClick={createRoom}>Create New Room</button>
      <br></br><button onClick={joinRandom}>Join Random Room</button>

    </div>
  );
}

export default Home;
