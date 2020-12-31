import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const highlightWin = { background: props.highlightCheck ? "pink" : "white" };
  return (
    <button className="square" onClick={props.onClick} style={highlightWin}>
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
        highlightCheck={this.props.highlightCheck(i)}
      />
    );
  }

  render() {
    const board = [];
    for (var i = 0; i < 3; i++) {
      const row = [];
      for (var j = 0; j < 3; j++) {
        row.push(this.renderSquare(i * 3 + j));
      }
      board.push(<div className="board-row">{row}</div>);
    }
    return <div>{board}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
      moveOrderAscending: true,
    };
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const status = !checkState(current.squares)
      ? `Next player: ${this.state.xIsNext ? "X" : "O"}`
      : checkState(current.squares);
    const moves = history.map((move, index) => {
      const desc = index
        ? `Go to move #${index} ${findLastMove(
            history[index - 1].squares,
            history[index].squares
          )}`
        : `Go to game start`;
      const boldActive = {
        fontWeight: index === this.state.stepNumber ? "bold" : "normal",
      };
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)} style={boldActive}>
            {desc}
          </button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            highlightCheck={(i) => this.highlightCheck(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.changeOrder()}>Reverse Order</button>
          {this.displayHistory(moves)}
        </div>
      </div>
    );
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (checkState(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: this.state.stepNumber + 1,
    });
  }
  jumpTo(index) {
    this.setState({ stepNumber: index, xIsNext: index % 2 === 0 });
  }
  changeOrder() {
    this.setState({ moveOrderAscending: !this.state.moveOrderAscending });
  }
  displayHistory(moves) {
    if (this.state.moveOrderAscending) {
      return <ol> {moves}</ol>;
    }
    return <ol reversed> {moves.reverse()}</ol>;
  }
  highlightCheck(query) {
    const squares = this.state.history[this.state.stepNumber].squares;
    var winTrio = [];
    const r = [0, 3, 6];
    const c = [0, 1, 2];
    for (var i = 0; i < 3; i++) {
      if (
        squares[r[i]] &&
        squares[r[i]] === squares[r[i] + 1] &&
        squares[r[i]] === squares[r[i] + 2]
      ) {
        winTrio = [r[i], r[i] + 1, r[i] + 2];
        break;
      }
      if (
        squares[c[i]] &&
        squares[c[i]] === squares[c[i] + 3] &&
        squares[c[i]] === squares[c[i] + 6]
      ) {
        winTrio = [c[i], c[i] + 3, c[i] + 6];
        break;
      }
    }
    if (squares[4] && squares[4] === squares[0] && squares[4] === squares[8]) {
      winTrio = [0, 4, 8];
    } else if (
      squares[4] &&
      squares[4] === squares[2] &&
      squares[4] === squares[6]
    ) {
      winTrio = [2, 4, 6];
    }
    return winTrio.includes(query);
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function findLastMove(squares_old, squares_new) {
  var i;
  for (i = 0; i < 9; i++) {
    if (squares_new[i] !== squares_old[i]) {
      break;
    }
  }
  return `(${Math.floor(i / 3) + 1}, ${(i % 3) + 1})`;
}

function checkState(squares) {
  const r = [0, 3, 6];
  const c = [0, 1, 2];
  for (var i = 0; i < 3; i++) {
    if (
      squares[r[i]] &&
      squares[r[i]] === squares[r[i] + 1] &&
      squares[r[i]] === squares[r[i] + 2]
    ) {
      return `Winner: ${squares[r[i]]}`;
    }
    if (
      squares[c[i]] &&
      squares[c[i]] === squares[c[i] + 3] &&
      squares[c[i]] === squares[c[i] + 6]
    ) {
      return `Winner: ${squares[c[i]]}`;
    }
  }
  if (
    squares[4] &&
    ((squares[4] === squares[0] && squares[4] === squares[8]) ||
      (squares[4] === squares[2] && squares[4] === squares[6]))
  ) {
    return `Winner: ${squares[4]}`;
  }
  for (var x = 0; x < squares.length; x++) {
    if (!squares[x]) {
      return null;
    }
  }
  return "Draw";
}
