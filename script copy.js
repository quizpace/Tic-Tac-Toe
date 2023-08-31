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
const board = document.getElementById("board");
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

restartButton.addEventListener("click", restartGame);
userOrComputerElement.classList.add("show");
userVsComButton.addEventListener("click", userVsCom);
userVsUserButton.addEventListener("click", userVsUser);
mainMenuButtonClick.addEventListener("click", mainMenu);

function userVsCom() {
  computerMode = true;
  userOrComputerElement.classList.remove("show");
  startUserVsComGame();
}

// Add the isValidMove function
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

function startUserVsComGame() {
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
  if (computerMode && circleTurn) {
    setTimeout(computerMove, 500);
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

function computerMove() {
  const emptyCells = [...cellElements].filter(
    (cell) =>
      !cell.classList.contains(X_CLASS) &&
      !cell.classList.contains(CIRCLE_CLASS)
  );
  if (emptyCells.length === 0) return;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];

  placeMark(randomCell, CIRCLE_CLASS);
  if (checkWin(CIRCLE_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
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
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combinations) => {
    return combinations.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

// Start the initial game when the page loads
startGame();