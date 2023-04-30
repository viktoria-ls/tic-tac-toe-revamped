import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext'
import AbilitySelect from '../components/AbilitySelect';
import Board from '../components/Board'

const abilityOptions = [
  {name: 'name1', description: 'desc1'},
  {name: 'name2', description: 'desc2'},
  {name: 'name3', description: 'desc3'},
  {name: 'name4', description: 'desc4'}];

function Game() {
  const socket = useContext(SocketContext);
  var params = useParams();
  const [playersSelect, setPlayersSelect] = useState(false);  // player is ready to select abilities
  const [playersReady, setPlayersReady] = useState(false); // players both finished selecting

  const [abilities, setAbilities] = useState([]);

  useEffect(() => {
    console.log('emitting in_game from react');
    socket.emit('in_game', params);
  }, []);

  useEffect(() => {
    socket.on('players_select', () => {
      console.log('players_select was emitted');
      setPlayersSelect(true);
    })

    socket.on('abilities_ready', (data) => {
      setAbilities(data.abilities);
      setPlayersSelect(false);
    });

    socket.on('players_ready', () => {
      console.log('ready');
      setPlayersReady(true);
    });
  }, [socket]);

  return (
    <div className="game-container">
      <button>Quit</button>

      {playersSelect && <AbilitySelect roomId={params.roomId} abilities={abilityOptions}/>}
      {playersReady && <Board abilities={abilities}/>}

      {(!playersSelect && !playersReady) &&
      <p>Waiting for other player</p>}
    </div>
  );
}

export default Game;
