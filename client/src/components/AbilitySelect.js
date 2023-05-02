import { useContext, useState } from 'react'
import { SocketContext } from '../context/SocketContext'
import styles from './AbilitySelect.module.css';

const Ability = ({name, description, select, index}) => {
    return (
        <div className={styles.ability} onClick={() => {select(index)}}>
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
            <h1>This is ability select</h1>
            <div className={styles.ability_container}>
                {abilities && abilities.map((a, index) => (
                    <Ability key={index} name={a.name} description={a.description} select={selectAbility} index={index}/>
                ))}
            </div>
            <button onClick={confirmAbilities}>Confirm</button>
        </div>
    );
}

export default AbilitySelect;