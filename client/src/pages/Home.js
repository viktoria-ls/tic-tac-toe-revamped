import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../context/SocketContext'

function Home() {
  const socket = useContext(SocketContext);
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
    // navigate to game page waiting screen
  }

  const joinRandom = () => {
    setRoomNotFound(false);
    socket.emit('join_random', {nickname});
    // navigate to game page init screen
  }

  useEffect(() => {
    socket.on('room_not_found', () => {
      setRoomNotFound(true);
    });

    socket.on('room_found', () => {
      // navigate to game page init screen with props {nickname, opponent nickname, room number}
      alert('youre in the room yay')
    })
  }, [socket]);

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
