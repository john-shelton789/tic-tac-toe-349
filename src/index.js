import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { // eslint-disable-line no-unused-vars
  const className = 'square ' + (props.winningsquare ? 'winningsquare' : '')
  return ( <
    button className = {
      className
    }
    onClick = {
      props.onClick
    } > {
      props.value
    } <
    /button>
  );
}

class Board extends React.Component { // eslint-disable-line no-unused-vars

    renderSquare(i) {
      const indexes = this.props.indexes;
      return ( <
        Square key = {
          i
        }
        value = {
          this.props.squares[i]
        }
        onClick = {
          () => this.props.onClick(i)
        }
        winningsquare = {
          indexes && indexes.includes(i)
        }
        />
      );
    }

    render() {
      console.log(this.props.size);
      let boardsize = this.props.size;
      let cols = [];
      for (let i = 0; i < boardsize; i++) {
        let row = [];
        for (let j = 0; j < boardsize; j++) {
          row.push(this.renderSquare(i * boardsize + j));
        }
        cols.push( < div key = {
            i
          }
          className = "board-row" > {
            row
          } < /div>);
        }

        return ( <
          div key = {
            cols
          } > {
            cols
          } < /div>
        );
      }
    }

    class Game extends React.Component { // eslint-disable-line no-unused-vars
      constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
          isAscending: true,
          boardsize: 3,
          stepNumber: 0,
          xIsNext: true,
          history: [{
            squares: Array(9).fill(null),
          }],
        };
      }

      handleSubmit(event) {
        event.preventDefault();
        console.log(event.target.size.value);
        let boardLength = parseInt(event.target.size.value) * parseInt(event.target.size.value);
        console.log(boardLength);
        console.log(typeof boardLength);
        this.setState({
          boardsize: parseInt(event.target.size.value),
          stepNumber: 0,
          xIsNext: true,
          history: [{
            squares: Array(boardLength).fill(null),
            lastCoords: 0
          }],
        });
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares, this.state.boardsize).winner || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            lastCoords: i
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
      }

      handleSort() {
        this.setState({
          isAscending: !this.state.isAscending
        });
      }

      jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }

      render() {
        var history = this.state.history;
        var current = history[this.state.stepNumber];
        var winInfo = calculateWinner(current.squares, this.state.boardsize);
        var winner = null;
        if (winInfo) {
          winner = winInfo.winner;
        }

        let moves = history.map((step, move) => {
          var lastCoords = step.lastCoords;
          var col = 1 + lastCoords % this.state.boardsize;
          var row = 1 + Math.floor(lastCoords / this.state.boardsize);
          var desc = move ?
            `Go to move #${move} (${col}, ${row})` :
            'Go to game start';

          return ( <
            li key = {
              move
            } >
            <
            button className = {
              move === this.state.stepNumber ? 'selected-move' : ''
            }
            onClick = {
              () => this.jumpTo(move)
            } > {
              desc
            } < /button> <
            /li>
          );
        });


        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          if (winInfo.isDraw) {
            status = "Draw";
          } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
          }
        }
        //reverse the order of the move list
        const isAscending = this.state.isAscending;
        if (!isAscending) {
          moves.reverse();
        }

        return ( <
          div className = "game" >
          <
          ul >
          <
          li >
          <
          label className = "title" > Tic - Tac - Toe! < /label> <
          /li> <
          li >
          <
          div >
          <
          ul >
          <
          li >
          <
          form className = "sizeform"
          onSubmit = {
            this.handleSubmit
          } >
          <
          label >
          Board Size:
          <
          input type = "number"
          name = "size"
          min = "2"
          defaultValue = {
            this.state.boardsize
          }
          /> <
          /label> <
          input type = "submit"
          value = "Start New Game" / >
          <
          /form> <
          /li> <
          li >
          <
          div > {
            status
          } < /div> <
          /li> <
          li >
          <
          div className = "game-board" >
          <
          Board squares = {
            current.squares
          }
          size = {
            this.state.boardsize
          }
          onClick = {
            (i) => this.handleClick(i)
          }
          indexes = {
            winInfo.indexes
          }
          /> <
          /div> <
          /li> <
          /ul> <
          /div> <
          /li> <
          li >
          <
          div className = "game-info" >
          <
          button onClick = {
            () => this.handleSort()
          } > {
            isAscending ? 'descending' : 'ascending'
          } <
          /button> <
          ol > {
            moves
          } <
          /ol> <
          /div> <
          /li> <
          /ul> <
          /div>
        );
      }
    }

    // ========================================

    ReactDOM.render( <
      Game / > ,
      document.getElementById('root')
    );

    function calculateWinner(squares, sizeboard) {

      let boardlength = sizeboard * sizeboard;


      let verticalwin = false;
      let horizontalwin = false;
      let diag1win = false;
      let diag2win = false;
      let isDraw = false;
      console.log("-----Beginning tests-----");
      console.log("board size = " + sizeboard);
      console.log("Squares: " + squares);
      //test for vertical win
      for (let i = 0; i < sizeboard; i++) {
        let verticalsquares = [];
        let verticalindexes = [];
        for (let j = i; j < boardlength; j += sizeboard) {
          console.log("i = " + i + " j= " + j);
          verticalsquares.push(squares[j]);
          verticalindexes.push(j);
        }
        verticalwin = verticalsquares.every(v => v === verticalsquares[0]);
        console.log("vertical test starting at i = " + i + ": " + verticalsquares);
        if (verticalwin === true && verticalsquares[0] != null && verticalsquares.length === sizeboard) {
          verticalwin = false;
          return {
            indexes: verticalindexes,
            winner: verticalsquares[0],
            isDraw: isDraw
          }
        }
      }
      //test for horizontal victory
      for (let k = 0; k < boardlength; k += sizeboard) {
        let horizontalsquares = [];
        let horizontalindexes = [];
        for (let l = k; l < k + sizeboard; l++) {
          console.log("k = " + k + " l = " + l);
          horizontalsquares.push(squares[l]);
          horizontalindexes.push(l);
        }
        horizontalwin = horizontalsquares.every(h => h === horizontalsquares[0]);
        console.log("horizontal test starting at k = " + k + ": " + horizontalsquares);
        if (horizontalwin === true && horizontalsquares[0] != null && horizontalsquares.length === sizeboard) {
          horizontalwin = false;
          return {
            indexes: horizontalindexes,
            winner: horizontalsquares[0],
            isDraw: isDraw
          }
        }
      }

      if (sizeboard > 1) { //diagonal code causes crashes with board size = 1

        //test for top-left-to-bottom-right diagonal victory
        let diag1squares = [];
        let diag1indexes = [];
        for (let i = 0; i < boardlength; i += sizeboard + 1) {
          console.log("i = " + i);
          diag1squares.push(squares[i]);
          diag1indexes.push(i);
        }

        diag1win = diag1squares.every(a => a === diag1squares[0]);
        console.log("diagonal 1 test: " + diag1squares);
        if (diag1win === true && diag1squares[0] != null && diag1squares.length === sizeboard) {
          diag1win = false;
          return {
            indexes: diag1indexes,
            winner: diag1squares[0],
            isDraw: isDraw
          }
        }

        //test for bottom-left-to-top-right diagonal victory
        let diag2squares = [];
        let diag2indexes = [];
        for (let j = sizeboard - 1; j < boardlength - sizeboard + 1; j += (sizeboard - 1)) {
          console.log("j = " + j)
          diag2squares.push(squares[j]);
          diag2indexes.push(j);
        }

        diag2win = diag2squares.every(a => a === diag2squares[0]);
        console.log("diagonal 2 test: " + diag2squares);
        if (diag2win === true && diag2squares[0] != null && diag2squares.length === sizeboard) {
          diag2win = false;
          return {
            indexes: diag2indexes,
            winner: diag2squares[0],
            isdraw: isDraw
          }
        }
      }

      //test for a draw
      isDraw = true;
      for (let i = 0; i < boardlength; i++) {
        if (squares[i] === null) {
          isDraw = false;
          break;
        }
      }

      return {
        indexes: null,
        winner: null,
        isDraw: isDraw
      }
    }
