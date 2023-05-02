import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext'
import styles from './Board.module.css';

// might move to boardUtils
const SIZE = 5;

const initBoard = () => {
    var boardRows = [];
    for(let i = 0; i < SIZE; i++) {
        var row = [];
        for(let j = 0; j < SIZE; j++)
            row.push('');
        boardRows.push(row);
    }
    return boardRows;
}

const Space = ({row, col, onClick, token}) => {
    return(
        <div className={styles.space} onClick={() => {onClick(row, col)}}>
            {token}
        </div>
    );
}

const Board = ({roomId, abilities, nickname, otherNickname, token}) => {
    const socket = useContext(SocketContext);
    const [yourTurn, setYourTurn] = useState(false);
    const [boardState] = useState(initBoard());

    useEffect(() => {
        socket.on('your_turn', (data) => {
            if('row' in data) {
                var {row, col} = data;
                boardState[row][col] = (token === 'X' ? 'O' : 'X');   
            }
            setYourTurn(true);
        });

    }, [socket]);

    const clickSpace = (row, col) => {
        if(yourTurn && boardState[row][col] === '') {
            boardState[row][col] = token;
            socket.emit('turn_done', {roomId, row, col});
            setYourTurn(false);
        }
    }

    return (
        <div>
            <h1>These are your abilities</h1>
            {abilities && abilities.map((a, index) => (
                <p key={index}>{a}</p>
            ))}

            <p>{yourTurn ? nickname + "'s (You)" : otherNickname + "'s"} Turn</p>

            <div className={styles.board}>
                {boardState.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.row}>
                        {row.map((spaceToken, colIndex) => (
                            <Space key={colIndex} row={rowIndex} col={colIndex} onClick={clickSpace} token={spaceToken}/>
                        ))}
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Board;