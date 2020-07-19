import * as Board from "./board";

export function uct(turn, board, nRollouts, C) {
  const rootNode = createNode(turn);
  for (let i = 0; i < nRollouts; ++i) {
    search(rootNode, turn, turn, board, C);
  }

  const { children } = rootNode;
  const childrenKeys = Object.keys(children);
  return [
    childrenKeys.reduce(
      (max, curr) => (children[curr].value > children[max].value ? curr : max),
      childrenKeys[0]
    ),
    rootNode
  ];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNode(turn) {
  return { value: -1, count: 0, turn, children: {} };
}

function selectMove(node, initTurn, moves, C) {
  const uctVals = moves.map(move => {
    const key = `${move[0]}-${move[1]}`;
    if (typeof node.children[key] === "undefined") {
      node.children[key] = createNode(node.turn === "X" ? "O" : "X");
    }
    const child = node.children[key];
    const explorationPart =
      child.count === 0
        ? Infinity
        : Math.sqrt(Math.log(node.count) / child.count);
    const uctVal =
      child.value +
      C * (node.turn === initTurn ? explorationPart : -explorationPart);

    return uctVal;
  });

  const func = Math[node.turn === initTurn ? "max" : "min"];
  const bestVal = func(...uctVals);
  const bestMoves = moves.filter((_, i) => uctVals[i] === bestVal);
  //console.log("- ", initTurn, node.turn, uctVals, bestVal);

  const chosenIndex = getRandomIntInclusive(0, bestMoves.length - 1);
  const chosenMove = bestMoves[chosenIndex];
  const chosenChild = node.children[`${chosenMove[0]}-${chosenMove[1]}`];
  //console.log("  - ", chosenMove, chosenChild);

  //console.log();
  return [chosenMove, chosenChild];
}

function search(node, turn, initTurn, board, C) {
  const won = Board.checkWin(board);
  if (won) {
    const value = won === initTurn ? 1 : -1;
    node.value = value;

    //console.log("WON: ", won, turn, value);
    return value;
  }
  if (Board.checkDraw(board)) {
    node.value = 0;
    //console.log("DRAW");
    return 0;
  }

  const moves = Board.getFreeCells(board);

  const [[iMove, jMove], childNode] = selectMove(node, initTurn, moves, C);

  const newBoard = Board.makeMove(jMove - 1, iMove - 1, turn, board);
  const newTurn = turn === "X" ? "O" : "X";

  const score = search(childNode, newTurn, initTurn, newBoard, C);

  // backup values
  childNode.value =
    (childNode.count * childNode.value + score) / (childNode.count + 1);
  // update node count
  node.count += 1;

  return score;
}
