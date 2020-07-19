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
  console.log(cellElem, elems);

  Array.from(elems).forEach(e => cellElem.appendChild(e));
}

function clearBoardElem(boardEl) {
  const cellElems = Array.from(boardEl.querySelectorAll(".cell"));

  cellElems.forEach(elem =>
    Array.from(elem.childNodes)
      .reverse()
      .forEach(child => elem.removeChild(child))
  );
}

function handleEnd(winner) {
  game = false;
  console.log("end");
  document.querySelector("#start-button").disabled = false;
}

const N_ROLLOUTS = 200;
const C = 1;

let board = Board.createNewBoard();
let boardCoordinates = { left: 0, right: 0, top: 0, bottom: 0 };
let turn = "O";
let game = false;

const boardEl = document.querySelector("#board");

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

document.querySelectorAll(".cell").forEach(el =>
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

    const split_ = move.split("-");

    const i_ = parseInt(split_[0]);
    const j_ = parseInt(split_[1]);
    console.log(i_, j_);

    [resMove, newBoard] = playMove(i_, j_, turn_, board);
    board = newBoard;
  })
);

document.querySelector("#start-button").addEventListener("click", e => {
  board = Board.createNewBoard();
  clearBoardElem(boardEl);
  e.target.disabled = true;
  game = true;
});
