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
    // Update circleTurn to indicate it's the computer's turn next
    circleTurn = false;
    setBoardHoverClass();
    if (computerMode && !circleTurn) {
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

  // Function to check if a combination has 2 out of 3 markers for the computer
  function hasTwoComputerMarkers(combination) {
    const [a, b, c] = combination;
    const cellA = cellElements[a];
    const cellB = cellElements[b];
    const cellC = cellElements[c];
    return (
      (cellA.classList.contains(CIRCLE_CLASS) &&
        cellB.classList.contains(CIRCLE_CLASS) &&
        !cellC.classList.contains(X_CLASS)) ||
      (cellA.classList.contains(CIRCLE_CLASS) &&
        cellC.classList.contains(CIRCLE_CLASS) &&
        !cellB.classList.contains(X_CLASS)) ||
      (cellB.classList.contains(CIRCLE_CLASS) &&
        cellC.classList.contains(CIRCLE_CLASS) &&
        !cellA.classList.contains(X_CLASS))
    );
  }

  // Check for potential user wins and block them
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const combination = WINNING_COMBINATIONS[i];
    const [a, b, c] = combination;
    const cellA = cellElements[a];
    const cellB = cellElements[b];
    const cellC = cellElements[c];

    // Check if the user has two of their marks in a winning combination
    if (
      cellA.classList.contains(X_CLASS) &&
      cellB.classList.contains(X_CLASS) &&
      !cellC.classList.contains(CIRCLE_CLASS)
    ) {
      // Play the computer's turn sound with a delay
      setTimeout(() => {
        const computerTurnSound = document.getElementById("o-turn-sound");
        computerTurnSound.pause();
        computerTurnSound.currentTime = 0;
        computerTurnSound.play();
      }, 50); // Adjust the delay time as needed

      // Delay the move itself to allow the sound to play
      setTimeout(() => {
        placeMark(cellC, CIRCLE_CLASS);
        updateGameStatus();
      }, 100); // Adjust the delay time as needed

      return;
    }

    // Check if the computer has 2 markers in a winning combination and complete it
    if (hasTwoComputerMarkers(combination)) {
      for (const cell of [cellA, cellB, cellC]) {
        if (
          !cell.classList.contains(X_CLASS) &&
          !cell.classList.contains(CIRCLE_CLASS)
        ) {
          // Play the computer's turn sound with a delay
          setTimeout(() => {
            const computerTurnSound = document.getElementById("o-turn-sound");
            computerTurnSound.pause();
            computerTurnSound.currentTime = 0;
            computerTurnSound.play();
          }, 50); // Adjust the delay time as needed

          // Delay the move itself to allow the sound to play
          setTimeout(() => {
            placeMark(cell, CIRCLE_CLASS);
            updateGameStatus();
          }, 100); // Adjust the delay time as needed

          return;
        }
      }
    }
  }

  // If no immediate threat or winning move, make a random move
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];

  // Play the computer's turn sound with a delay
  setTimeout(() => {
    const computerTurnSound = document.getElementById("o-turn-sound");
    computerTurnSound.pause();
    computerTurnSound.currentTime = 0;
    computerTurnSound.play();
  }, 50); // Adjust the delay time as needed

  // Delay the move itself to allow the sound to play
  setTimeout(() => {
    placeMark(randomCell, CIRCLE_CLASS);
    updateGameStatus();
  }, 100); // Adjust the delay time as needed

  // בדוק האם המחשב ניצח אחרי המהלך
  if (checkWin(CIRCLE_CLASS)) {
    // קריאה לפונקציה endGame כאשר המשחק נגמר עם ניצחון של המחשב
    endGame(true);
    return;
  }
}

function endGame(draw) {
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  const winningCellClass = circleTurn ? "winning-cell-o" : "winning-cell-x";

  // מוצא את הקומבינציה המנצחת
  const winningCombination = WINNING_COMBINATIONS.find((combinations) => {
    return combinations.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });

  if (draw) {
    const drawCell = "draw-cell";
    cellElements.forEach((cell) => {
      cell.classList.add(drawCell);
    });
    winningMessageTextElement.innerText = "Draw!";
    setTimeout(() => {
      cellElements.forEach((cell) => {
        cell.classList.remove(drawCell);
      });
      winningMessageElement.classList.add("show");

      // קריאה לפונקציה updateGameStatus עם הפרמטר draw
      updateGameStatus(draw);
    }, 1000);
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;

    // משנה את המחלקות של התאים בקומבינציה המנצחת
    if (winningCombination) {
      winningCombination.forEach((index) => {
        cellElements[index].classList.add(winningCellClass);
      });
    }

    // השהיית הצגת ההודעה על הניצחון בזמן שהסגנון משתנה
    setTimeout(() => {
      // הסר את הסגנון של התאים בקומבינציה המנצחת
      if (winningCombination) {
        winningCombination.forEach((index) => {
          cellElements[index].classList.remove(winningCellClass);
        });
      }
      winningMessageElement.classList.add("show");

      // קריאה לפונקציה updateGameStatus עם הפרמטר false (משמעו ניצחון)
      updateGameStatus(false);
    }, 1500);
  }
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

function updateGameStatus() {
  // Handle the game status here if needed
}

startGame();

playBackgroundMusic();
