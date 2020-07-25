import * as Board from "./board";
import { uct } from "./uct";

function toggleTurn(turn) {
  return turn === "O" ? "X" : "O";
}

function createElemWithClassName(tagName, ...classNames) {
  const elem = document.createElement(tagName);
  classNames.forEach(name => elem.classList.add(name));
  return elem;
}

function createX() {
  return [
    createElemWithClassName("div", "x-cell-line", "rotate45"),
    createElemWithClassName("div", "x-cell-line", "rotate45neg")
  ];
}

function createO() {
  return [createElemWithClassName("div", "o-cell")];
}

function draw(turn, i, j) {
  const elems = turn === "X" ? createX() : createO();
  const cellElem = document.querySelector(`#cell-${i}-${j}`);

  Array.from(elems).forEach(e => cellElem.appendChild(e));
}

function playMove(i, j, turn, board) {
  draw(turn, i, j);
  board = Board.makeMove(j - 1, i - 1, turn, board);
  const win = Board.checkWin(board);
  if (win) {
    handleEnd(win);
    return [win, board];
  }
  if (Board.checkDraw(board)) {
    handleEnd();
    return ["", board];
  }
  return [false, board];
}

function showTurn(turn) {
  document.querySelector("#current-turn").innerHTML = turn;
}

function clearBoardElem() {
  cellElems.forEach(elem =>
    Array.from(elem.childNodes)
      .reverse()
      .forEach(child => elem.removeChild(child))
  );
}

function handleEnd(winner) {
  game = false;
  startButtonElem.disabled = false;
  clickToStartElem.style.opacity = 1;

  gameResultElem.innerHTML =
    typeof winner === "undefined" ? "Draw!" : `${winner} won!`;
  gameResultElem.style.opacity = 1;

  turnIndicator.style.opacity = 0;
}

function startGame(e) {
  board = Board.createNewBoard();
  clearBoardElem();
  e.target.disabled = true;
  game = true;
  showTurn(turn);
  clickToStartElem.style.opacity = 0;
  gameResultElem.style.opacity = 0;
  turnIndicator.style.opacity = 1;
}

const N_ROLLOUTS = 500;
const C = 1;

// Game state
// ================================================================
let board = Board.createNewBoard();
let turn = "O";
let game = false;
// ================================================================
// Elements
// ================================================================
let boardEl = document.querySelector("#board");
let cellElems = document.querySelectorAll(".cell");
let gameResultElem = document.querySelector("#game-result");
let startButtonElem = document.querySelector("#start-button");
let clickToStartElem = document.querySelector("#click-to-start");
let turnIndicator = document.querySelector("#turn-indicator");
// ================================================================

document.addEventListener("DOMContentLoaded", function() {
  // Elements
  // ================================================================
  boardEl = document.querySelector("#board");
  cellElems = document.querySelectorAll(".cell");
  gameResultElem = document.querySelector("#game-result");
  startButtonElem = document.querySelector("#start-button");
  clickToStartElem = document.querySelector("#click-to-start");
  turnIndicator = document.querySelector("#turn-indicator");
  // ================================================================

  cellElems.forEach(el =>
    el.addEventListener("click", function(e) {
      if (!game) return;

      const { id } = e.target;
      const split = id.split("-");
      const i = parseInt(split[1]);
      const j = parseInt(split[2]);

      let [resMove, newBoard] = playMove(i, j, turn, board);
      board = newBoard;
      if (resMove !== false) {
        return;
      }

      const turn_ = toggleTurn(turn);
      const [move] = uct(turn_, board, N_ROLLOUTS, C);
      console.log("UCT finished: ", move);

      showTurn(turn_);

      const split_ = move.split("-");
      const i_ = parseInt(split_[0]);
      const j_ = parseInt(split_[1]);

      setTimeout(() => {
        [resMove, newBoard] = playMove(i_, j_, turn_, board);
        board = newBoard;
        showTurn(turn);
      }, 1000);
    })
  );

  startButtonElem.addEventListener("click", startGame);
  startButtonElem.addEventListener("touchstart", startGame);
});
