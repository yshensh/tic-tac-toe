import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button 
//         className="square" 
//         onClick={()=> this.props.onClick()}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// instead of defining a class which extends React.Component, we write a function that takes props as input and returns what should be rendered 
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}  
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  // set up the initial state for the Game compoenent within in its constructor. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the 'history'  
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      // each time a player moves, xIsNext will be flipped to determine which player goes next and the game's state will be saved
      xIsNext: true,
      // indicate which step we're currently viewing
      stepNumber: 0,
    };
  }

  handleClick(i) {
    // This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect. 
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // ignore a click if someone has won the game or if a square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      // flip the value of xIsNext
      xIsNext: !this.state.xIsNext,
      // after making a new move, we need to update stepNumber by adding 'history.length' as part of the this.setState argument. This ensures we don't get stuck showing the same move after a new one has been made
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // use the most recent history entry to determine and display the game's status
    const history = this.state.history;
    // rendering the currently selected move according to 'stepNumber'
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map(
      (step, move) => {
        const desc = move ?
        'Go to move #' + move :
        'Go to game start';
        return (
          // assign proper key when building a dynamic lists
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

    // change the "status" text in Board's render so that it displays which player has the next turn
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(sqaures) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (sqaures[a] && sqaures[a] === sqaures[b] && sqaures[a] === sqaures[c]) {
      return sqaures[a];
    }
  }
  return null;
}