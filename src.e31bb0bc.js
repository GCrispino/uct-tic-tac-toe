// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"board.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNewBoard = createNewBoard;
exports.makeMove = makeMove;
exports.checkWin = checkWin;
exports.getFreeCells = getFreeCells;
exports.checkDraw = checkDraw;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function createNewBoard() {
  return [["", "", ""], ["", "", ""], ["", "", ""]];
}

function makeMove(x, y, move, board) {
  var rowToChange = _toConsumableArray(board[y]);

  rowToChange[x] = move;
  return board.map(function (r, i) {
    return i === y ? rowToChange : r;
  });
}

function checkWin(board) {
  // horizontal
  if (board[0][0] === board[0][1] && board[0][1] === board[0][2]) {
    return board[0][0];
  } else if (board[1][0] === board[1][1] && board[1][1] === board[1][2]) {
    return board[1][0];
  } else if (board[2][0] === board[2][1] && board[2][1] === board[2][2]) {
    return board[2][0];
  } // vertical
  else if (board[0][0] === board[1][0] && board[1][0] === board[2][0]) {
      return board[0][0];
    } else if (board[0][1] === board[1][1] && board[1][1] === board[2][1]) {
      return board[0][1];
    } else if (board[0][2] === board[1][2] && board[1][2] === board[2][2]) {
      return board[0][2];
    } // diagonal
    else if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
      } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
      }

  return false;
}

function getFreeCells(board) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(board.map(function (row, i) {
    return row.map(function (cell, j) {
      return cell === "" ? [i + 1, j + 1] : [];
    }).filter(function (x) {
      return x.length > 0;
    });
  })));
}

function checkDraw(board) {
  return board.map(function (row) {
    return row.filter(function (cell) {
      return cell === "";
    }).length;
  }).reduce(function (prev, acc) {
    return prev + acc;
  }, 0) === 0;
}
},{}],"uct.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uct = uct;

var Board = _interopRequireWildcard(require("./board"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function uct(turn, board, nRollouts, C) {
  var rootNode = createNode(turn);

  for (var i = 0; i < nRollouts; ++i) {
    search(rootNode, turn, turn, board, C);
  }

  var children = rootNode.children;
  var childrenKeys = Object.keys(children);
  return [childrenKeys.reduce(function (max, curr) {
    return children[curr].value > children[max].value ? curr : max;
  }, childrenKeys[0]), rootNode];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNode(turn) {
  return {
    value: -1,
    count: 0,
    turn: turn,
    children: {}
  };
}

function selectMove(node, initTurn, moves, C) {
  var uctVals = moves.map(function (move) {
    var key = "".concat(move[0], "-").concat(move[1]);

    if (typeof node.children[key] === "undefined") {
      node.children[key] = createNode(node.turn === "X" ? "O" : "X");
    }

    var child = node.children[key];
    var explorationPart = child.count === 0 ? Infinity : Math.sqrt(Math.log(node.count) / child.count);
    var uctVal = child.value + C * (node.turn === initTurn ? explorationPart : -explorationPart);
    return uctVal;
  });
  var func = Math[node.turn === initTurn ? "max" : "min"];
  var bestVal = func.apply(void 0, _toConsumableArray(uctVals));
  var bestMoves = moves.filter(function (_, i) {
    return uctVals[i] === bestVal;
  });
  var chosenIndex = getRandomIntInclusive(0, bestMoves.length - 1);
  var chosenMove = bestMoves[chosenIndex];
  var chosenChild = node.children["".concat(chosenMove[0], "-").concat(chosenMove[1])];
  return [chosenMove, chosenChild];
}

function search(node, turn, initTurn, board, C) {
  var won = Board.checkWin(board);

  if (won) {
    var value = won === initTurn ? 1 : -1;
    node.value = value;
    return value;
  }

  if (Board.checkDraw(board)) {
    node.value = 0;
    return 0;
  }

  var moves = Board.getFreeCells(board);

  var _selectMove = selectMove(node, initTurn, moves, C),
      _selectMove2 = _slicedToArray(_selectMove, 2),
      _selectMove2$ = _slicedToArray(_selectMove2[0], 2),
      iMove = _selectMove2$[0],
      jMove = _selectMove2$[1],
      childNode = _selectMove2[1];

  var newBoard = Board.makeMove(jMove - 1, iMove - 1, turn, board);
  var newTurn = turn === "X" ? "O" : "X";
  var score = search(childNode, newTurn, initTurn, newBoard, C); // backup values

  childNode.value = (childNode.count * childNode.value + score) / (childNode.count + 1); // update node count

  node.count += 1;
  return score;
}
},{"./board":"board.js"}],"index.js":[function(require,module,exports) {
"use strict";

var Board = _interopRequireWildcard(require("./board"));

var _uct3 = require("./uct");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function toggleTurn(turn) {
  return turn === "O" ? "X" : "O";
}

function createElemWithClassName(tagName) {
  var elem = document.createElement(tagName);

  for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classNames[_key - 1] = arguments[_key];
  }

  classNames.forEach(function (name) {
    return elem.classList.add(name);
  });
  return elem;
}

function createX() {
  return [createElemWithClassName("div", "x-cell-line", "rotate45"), createElemWithClassName("div", "x-cell-line", "rotate45neg")];
}

function createO() {
  return [createElemWithClassName("div", "o-cell")];
}

function draw(turn, i, j) {
  var elems = turn === "X" ? createX() : createO();
  var cellElem = document.querySelector("#cell-".concat(i, "-").concat(j));
  Array.from(elems).forEach(function (e) {
    return cellElem.appendChild(e);
  });
}

function playMove(i, j, turn, board) {
  draw(turn, i, j);
  board = Board.makeMove(j - 1, i - 1, turn, board);
  var win = Board.checkWin(board);

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
  cellElems.forEach(function (elem) {
    return Array.from(elem.childNodes).reverse().forEach(function (child) {
      return elem.removeChild(child);
    });
  });
}

function handleEnd(winner) {
  game = false;
  startButtonElem.disabled = false;
  clickToStartElem.style.opacity = 1;
  gameResultElem.innerHTML = typeof winner === "undefined" ? "Draw!" : "".concat(winner, " won!");
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

var N_ROLLOUTS = 500;
var C = 1; // Game state
// ================================================================

var board = Board.createNewBoard();
var turn = "O";
var game = false; // ================================================================
// Elements
// ================================================================

var boardEl = document.querySelector("#board");
var cellElems = document.querySelectorAll(".cell");
var gameResultElem = document.querySelector("#game-result");
var startButtonElem = document.querySelector("#start-button");
var clickToStartElem = document.querySelector("#click-to-start");
var turnIndicator = document.querySelector("#turn-indicator"); // ================================================================

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  // ================================================================
  boardEl = document.querySelector("#board");
  cellElems = document.querySelectorAll(".cell");
  gameResultElem = document.querySelector("#game-result");
  startButtonElem = document.querySelector("#start-button");
  clickToStartElem = document.querySelector("#click-to-start");
  turnIndicator = document.querySelector("#turn-indicator"); // ================================================================

  cellElems.forEach(function (el) {
    return el.addEventListener("click", function (e) {
      if (!game) return;
      var id = e.target.id;
      var split = id.split("-");
      var i = parseInt(split[1]);
      var j = parseInt(split[2]);

      var _playMove = playMove(i, j, turn, board),
          _playMove2 = _slicedToArray(_playMove, 2),
          resMove = _playMove2[0],
          newBoard = _playMove2[1];

      board = newBoard;

      if (resMove !== false) {
        return;
      }

      var turn_ = toggleTurn(turn);

      var _uct = (0, _uct3.uct)(turn_, board, N_ROLLOUTS, C),
          _uct2 = _slicedToArray(_uct, 1),
          move = _uct2[0];

      console.log("UCT finished: ", move);
      showTurn(turn_);
      var split_ = move.split("-");
      var i_ = parseInt(split_[0]);
      var j_ = parseInt(split_[1]);
      setTimeout(function () {
        var _playMove3 = playMove(i_, j_, turn_, board);

        var _playMove4 = _slicedToArray(_playMove3, 2);

        resMove = _playMove4[0];
        newBoard = _playMove4[1];
        board = newBoard;
        showTurn(turn);
      }, 1000);
    });
  });
  startButtonElem.addEventListener("click", startGame);
  startButtonElem.addEventListener("touchstart", startGame);
});
},{"./board":"board.js","./uct":"uct.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44069" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map