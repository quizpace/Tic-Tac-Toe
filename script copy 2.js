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
const muteAllButton = document.getElementById("mute-buttons");
const muteToggleButton = document.getElementById("mute-toggle-button");
const backgroundMusic = document.getElementById("background-music");
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
let isSoundMuted = false;
let boardState = ["", "", "", "", "", "", "", "", ""];

restartButton.addEventListener("click", restartGame);
userOrComputerElement.classList.add("show");
userVsComButton.addEventListener("click", userVsCom);
userVsUserButton.addEventListener("click", userVsUser);
mainMenuButtonClick.addEventListener("click", mainMenu);
muteAllButton.addEventListener("click", toggleSound);

muteToggleButton.addEventListener("click", () => {
  backgroundMusic.muted = !backgroundMusic.muted;
});

function toggleSound() {
  isSoundMuted = !isSoundMuted;

  // Toggle individual sounds
  const oTurnSound = document.getElementById("o-turn-sound");
  const xTurnSound = document.getElementById("x-turn-sound");
  const clickSound = document.getElementById("click-sound");

  oTurnSound.muted = isSoundMuted;
  xTurnSound.muted = isSoundMuted;
  clickSound.muted = isSoundMuted;

  muteAllButton.innerHTML = isSoundMuted ? "🔇" : "🔊";
}

function playBackgroundMusic() {
  backgroundMusic.play();
}

function computerMove() {
  const emptyCells = [...cellElements].filter(
    (cell) =>
      !cell.classList.contains(X_CLASS) &&
      !cell.classList.contains(CIRCLE_CLASS)
  );
  if (emptyCells.length === 0) return;

  let bestMove;
  let bestScore = -Infinity;

  for (let i = 0; i < emptyCells.length; i++) {
    const cell = emptyCells[i];
    cell.classList.add(CIRCLE_CLASS);
    // const score = minimax(getBoardState(), 0, false);
    cell.classList.remove(CIRCLE_CLASS);

    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  }

  const computerTurnSound = document.getElementById("o-turn-sound");
  computerTurnSound.pause();
  computerTurnSound.currentTime = 0;
  computerTurnSound.play();

  placeMark(bestMove, CIRCLE_CLASS);
  if (checkWin(CIRCLE_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}

function userVsCom() {
  const buttonSound = document.getElementById("click-sound");
  buttonSound.pause();
  buttonSound.currentTime = 0;
  buttonSound.play();
  computerMode = true;
  userOrComputerElement.classList.remove("show");
  startUserVsComGame();
}

function isValidMove(cell) {
  return (
    !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)
  );
}

function userVsUser() {
  const buttonSound = document.getElementById("click-sound");
  buttonSound.pause();
  buttonSound.currentTime = 0;
  buttonSound.play();
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

  const restartSound = document.getElementById("click-sound");
  restartSound.pause();
  restartSound.currentTime = 0;
  restartSound.play();
}

function mainMenu() {
  const menuSound = document.getElementById("click-sound");
  menuSound.pause();
  menuSound.currentTime = 0;
  menuSound.play();

  // When the sound ends, reload the page
  menuSound.addEventListener("ended", () => {
    location.reload();
  });
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

  // Play the appropriate turn sound
  if (currentClass === CIRCLE_CLASS) {
    // It's O's turn, play O's turn sound
    const oTurnSound = document.getElementById("o-turn-sound");
    oTurnSound.pause();
    oTurnSound.currentTime = 0;
    oTurnSound.play();
  } else {
    // It's X's turn, play X's turn sound
    const xTurnSound = document.getElementById("x-turn-sound");
    xTurnSound.pause();
    xTurnSound.currentTime = 0;
    xTurnSound.play();
  }

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

  // Play the computer's turn sound
  const computerTurnSound = document.getElementById("o-turn-sound");
  computerTurnSound.pause();
  computerTurnSound.currentTime = 0;
  computerTurnSound.play();

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

startGame();

playBackgroundMusic();