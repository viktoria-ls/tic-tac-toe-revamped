const Board = ({abilities}) => {
    return (
        <div>
            <h1>This is the board</h1>
            {abilities && abilities.map((a, index) => (
                <p key={index}>{a}</p>
            ))}
        </div>
    );
}

export default Board;