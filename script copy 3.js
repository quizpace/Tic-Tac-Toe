const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll("[data-cell]");
const gameBoardElement = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const userOrComputerElement = document.getElementById("userOrComputer");
const userVsComButton = document.getElementById("userVsCom");
const userVsUserButton = document.getElementById("userVsUser");
const mainMenuButtonClick = document.getElementById("mainMenuButton");
const restartButton = document.getElementById("restartButton");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);

let circleTurn = false;
let computerMode = false;

const gameBoard = Array.from(Array(9).fill(""));

restartButton.addEventListener("click", restartGame);
userOrComputerElement.classList.add("show");
userVsComButton.addEventListener("click", userVsCom);
userVsUserButton.addEventListener("click", userVsUser);
mainMenuButtonClick.addEventListener("click", mainMenu);

function isValidMove(cell) {
  return (
    !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)
  );
}

function userVsUser() {
  computerMode = false;
  userOrComputerElement.classList.remove("show");
  startGame();
}

function restartGame() {
  if (computerMode) {
    startUserVsComGame();
  } else {
    startGame();
  }
}

function mainMenu() {
  location.reload();
}
function userVsCom() {
  computerMode = true;
  userOrComputerElement.classList.remove("show");
  startUserVsComGame();
}

function startUserVsComGame() {
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleUserClick);
    cell.removeEventListener("click", computerMove);
    cell.addEventListener("click", handleUserClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");

  if (computerMode && circleTurn) {
    setTimeout(() => {
      computerMove();
    }, 500);
  }
}

function handleUserClick(e) {
  const cell = e.target;
  if (!isValidMove(cell)) return;

  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  const index = parseInt(cell.getAttribute("data-cell"));
  gameBoard[index] = currentClass;
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
    return;
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    if (computerMode && circleTurn) {
      setTimeout(computerMove, 500);
    }
  }
}

function startGame() {
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  if (!isValidMove(cell)) return;

  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  const index = parseInt(cell.getAttribute("data-cell"));
  gameBoard[index] = currentClass;
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
    return;
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    if (computerMode && circleTurn) {
      setTimeout(computerMove, 500);
    }
  }
}

function minimax(board, depth, isMaximizing) {
  if (checkWin(CIRCLE_CLASS)) {
    return 1;
  }
  if (checkWin(X_CLASS)) {
    return -1;
  }
  if (isDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = CIRCLE_CLASS;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(bestScore, score);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = X_CLASS;
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(bestScore, score);
      }
    }
    return bestScore;
  }
}

function computerMove() {
  const emptyCells = [...cellElements].filter(
    (cell) =>
      !cell.classList.contains(X_CLASS) &&
      !cell.classList.contains(CIRCLE_CLASS)
  );
  if (emptyCells.length === 0) return;

  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < emptyCells.length; i++) {
    const index = parseInt(emptyCells[i].getAttribute("data-cell"));
    board[index] = CIRCLE_CLASS;

    // Call minimax function to evaluate the score for the current move
    let score = minimax(board, 0, false);

    board[index] = "";

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }
}
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add("show");
}

function isDraw() {
  return gameBoard.every((cell) => cell !== "");
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  gameBoardElement.classList.remove(X_CLASS);
  gameBoardElement.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    gameBoardElement.classList.add(CIRCLE_CLASS);
  } else {
    gameBoardElement.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combinations) => {
    return combinations.every((index) => {
      return gameBoard[index] === currentClass;
    });
  });
}

// Start the initial game when the page loads
startGame();
