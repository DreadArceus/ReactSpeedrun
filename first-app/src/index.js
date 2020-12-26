import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      gameInProgress: true,
      winner: "",
    };
  }
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (!this.state.gameInProgress || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      gameInProgress: !checkState(squares, i),
      winner: checkState(squares, i),
    });
  }

  render() {
    const status = this.state.gameInProgress
      ? `Next player: ${this.state.xIsNext ? "X" : "O"}`
      : this.state.winner;
    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function checkState(squares, i) {
  const r = i - (i % 3);
  const c = i % 3;
  if (
    (squares[r] === squares[r + 1] && squares[r] === squares[r + 2]) ||
    (squares[c] === squares[c + 3] && squares[c] === squares[c + 6]) ||
    (squares[4] &&
      i % 2 === 0 &&
      ((squares[4] === squares[0] && squares[4] === squares[8]) ||
        (squares[4] === squares[2] && squares[4] === squares[6])))
  ) {
    return `Winner: ${squares[i]}`;
  }
  for (var x = 0; x < squares.length; x++) {
    if (!squares[x]) {
      return null;
    }
  }
  return "Draw";
}
