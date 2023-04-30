import { useContext, useState } from 'react'
import { SocketContext } from '../context/SocketContext'

const Ability = ({name, description, select, index}) => {
    return (
        <div onClick={() => {select(index)}}>
            <p>{name}</p>
            <p>{description}</p>
        </div>
    );
}

const AbilitySelect = ({roomId, abilities}) => {
    const socket = useContext(SocketContext);
    const [chosenAbilities, setChosenAbilities] = useState([]);

    const selectAbility = (abilityIndex) => {
        setChosenAbilities(chosenAbilities.concat(abilityIndex));
        alert(`chose ${abilityIndex}`);
    }

    const confirmAbilities = () => {
        // returns selected abilities to Game
        socket.emit('confirm_abilities', {abilities: chosenAbilities, roomId});
    }

    return (
        <div>
            {abilities && abilities.map((a, index) => (
                <Ability key={index} name={a.name} description={a.description} select={selectAbility} index={index}/>
            ))}

            <h1>This is ability select</h1>
            <button onClick={confirmAbilities}>Confirm</button>
        </div>
    );
}

export default AbilitySelect;