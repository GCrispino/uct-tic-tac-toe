export function createNewBoard() {
  return [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
}

export function makeMove(x, y, move, board) {
  const rowToChange = [...board[y]];
  rowToChange[x] = move;

  return board.map((r, i) => (i === y ? rowToChange : r));
}

export function checkWin(board) {
  // horizontal
  if (board[0][0] === board[0][1] && board[0][1] === board[0][2]) {
    return board[0][0];
  } else if (board[1][0] === board[1][1] && board[1][1] === board[1][2]) {
    return board[1][0];
  } else if (board[2][0] === board[2][1] && board[2][1] === board[2][2]) {
    return board[2][0];
  }
  // vertical
  else if (board[0][0] === board[1][0] && board[1][0] === board[2][0]) {
    return board[0][0];
  } else if (board[0][1] === board[1][1] && board[1][1] === board[2][1]) {
    return board[0][1];
  } else if (board[0][2] === board[1][2] && board[1][2] === board[2][2]) {
    return board[0][2];
  }
  // diagonal
  else if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }

  return false;
}

export function getFreeCells(board) {
  return [].concat(
    ...board.map((row, i) =>
      row
        .map((cell, j) => (cell === "" ? [i + 1, j + 1] : []))
        .filter(x => x.length > 0)
    )
  );
}

export function checkDraw(board) {
  return (
    board
      .map(row => row.filter(cell => cell === "").length)
      .reduce((prev, acc) => prev + acc, 0) === 0
  );
}
