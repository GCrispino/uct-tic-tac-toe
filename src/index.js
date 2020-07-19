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

const N_ROLLOUTS = 200;
const C = 1;

// Game state
// ================================================================
let board = Board.createNewBoard();
let boardCoordinates = { left: 0, right: 0, top: 0, bottom: 0 };
let turn = "O";
let game = false;
// ================================================================

// Elements
// ================================================================
const boardEl = document.querySelector("#board");
const cellElems = document.querySelectorAll(".cell");
const gameResultElem = document.querySelector("#game-result");
const startButtonElem = document.querySelector("#start-button");
const clickToStartElem = document.querySelector("#click-to-start");
const turnIndicator = document.querySelector("#turn-indicator");
// ================================================================

// Callback function to execute when mutations are observed
const callback = function(mutationsList) {
  // Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {
    if (mutation.target === boardEl) {
      const {
        left,
        right,
        top,
        bottom
      } = mutation.target.getBoundingClientRect();
      boardCoordinates = { left, right, top, bottom };
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new ResizeObserver(callback);

// Start observing the target node for configured mutations
observer.observe(boardEl);

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

startButtonElem.addEventListener("click", e => {
  board = Board.createNewBoard();
  clearBoardElem();
  e.target.disabled = true;
  game = true;
  showTurn(turn);
  clickToStartElem.style.opacity = 0;
  gameResultElem.style.opacity = 0;
  turnIndicator.style.opacity = 1;
});
