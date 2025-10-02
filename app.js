// ====================
// Constants
// ====================
const ROWS = 6;
const COLS = 7;
const EMPTY_SLOT = "-";

// ====================
// DOM Elements
// ====================
const matrix = document.getElementById("playground");
const header = document.getElementById("header");
const resetButton = document.getElementById("resetButton");

// ====================
// Game State
// ====================
let boardState = createEmptyBoard();
let currentPlayer = "Y";
let gameActive = true;
let winnerCells = [];

// ====================
// Utility Functions
// ====================

// ====================
// Utility Functions
// ====================

/**
 * Create an empty game board
 */
function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY_SLOT));
}

// ====================
// Rendering Functions
// ====================

/**
 * Render the complete game board
 */

// ====================
// Rendering Functions
// ====================

/**
 * Render the complete game board
 */
function renderBoard() {
  matrix.innerHTML = "";

  for (let rowIndex = 0; rowIndex < ROWS; rowIndex += 1) {
    const rowFragment = document.createElement("div");
    rowFragment.className = "row";
    rowFragment.setAttribute("role", "row");

    for (let colIndex = 0; colIndex < COLS; colIndex += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = String(rowIndex);
      cell.dataset.column = String(colIndex);
      cell.setAttribute("role", "gridcell");
      cell.tabIndex = gameActive ? 0 : -1;

      const cellValue = boardState[rowIndex][colIndex];

      if (cellValue === "Y") {
        cell.classList.add("yellow");
        cell.setAttribute(
          "aria-label",
          `Yellow checker at row ${rowIndex + 1}, column ${colIndex + 1}`
        );
      } else if (cellValue === "R") {
        cell.classList.add("red");
        cell.setAttribute(
          "aria-label",
          `Red checker at row ${rowIndex + 1}, column ${colIndex + 1}`
        );
      } else {
        cell.setAttribute(
          "aria-label",
          `Empty slot at row ${rowIndex + 1}, column ${
            colIndex + 1
          }. Click to drop a checker.`
        );
      }

      const isWinningCell = winnerCells.some(
        ([r, c]) => r === rowIndex && c === colIndex
      );
      if (isWinningCell) {
        cell.classList.add("winner");
      }

      rowFragment.appendChild(cell);
    }

    matrix.appendChild(rowFragment);
  }
}

// ====================
// Game Logic Functions
// ====================

/**
 * Drop a checker token into the specified column
 */

// ====================
// Game Logic Functions
// ====================

/**
 * Drop a checker token into the specified column
 */
function dropToken(column) {
  if (!gameActive) return false;

  for (let rowIndex = ROWS - 1; rowIndex >= 0; rowIndex -= 1) {
    if (boardState[rowIndex][column] === EMPTY_SLOT) {
      boardState[rowIndex][column] = currentPlayer;
      return true;
    }
  }

  return false;
}

/**
 * Check if there's a winning combination on the board
 */

/**
 * Check if there's a winning combination on the board
 */
function checkWin() {
  const checkLine = (a, b, c, d) =>
    a !== EMPTY_SLOT && a === b && a === c && a === d;

  // Check horizontal wins
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS - 3; c += 1) {
      if (
        checkLine(
          boardState[r][c],
          boardState[r][c + 1],
          boardState[r][c + 2],
          boardState[r][c + 3]
        )
      ) {
        winnerCells = [
          [r, c],
          [r, c + 1],
          [r, c + 2],
          [r, c + 3],
        ];
        return true;
      }
    }
  }

  // Check vertical wins
  for (let r = 0; r < ROWS - 3; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (
        checkLine(
          boardState[r][c],
          boardState[r + 1][c],
          boardState[r + 2][c],
          boardState[r + 3][c]
        )
      ) {
        winnerCells = [
          [r, c],
          [r + 1, c],
          [r + 2, c],
          [r + 3, c],
        ];
        return true;
      }
    }
  }

  // Check diagonal wins (down-right)
  for (let r = 0; r < ROWS - 3; r += 1) {
    for (let c = 0; c < COLS - 3; c += 1) {
      if (
        checkLine(
          boardState[r][c],
          boardState[r + 1][c + 1],
          boardState[r + 2][c + 2],
          boardState[r + 3][c + 3]
        )
      ) {
        winnerCells = [
          [r, c],
          [r + 1, c + 1],
          [r + 2, c + 2],
          [r + 3, c + 3],
        ];
        return true;
      }
    }
  }

  // Check diagonal wins (up-right)
  for (let r = 3; r < ROWS; r += 1) {
    for (let c = 0; c < COLS - 3; c += 1) {
      if (
        checkLine(
          boardState[r][c],
          boardState[r - 1][c + 1],
          boardState[r - 2][c + 2],
          boardState[r - 3][c + 3]
        )
      ) {
        winnerCells = [
          [r, c],
          [r - 1, c + 1],
          [r - 2, c + 2],
          [r - 3, c + 3],
        ];
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if the board is completely filled (tie game)
 */

/**
 * Check if the board is completely filled (tie game)
 */
function checkTie() {
  return boardState.every((row) => row.every((cell) => cell !== EMPTY_SLOT));
}

// ====================
// UI Update Functions
// ====================

/**
 * Update the header message
 */
function updateHeader(message) {
  header.textContent = message;
}

/**
 * Announce the next player's turn
 */
function announceNextTurn() {
  const nextPlayerName = currentPlayer === "Y" ? "Yellow" : "Red";
  updateHeader(`${nextPlayerName}'s Turn`);
}

// ====================
// Game Control Functions
// ====================

/**
 * Handle a player's move
 */

// ====================
// Game Control Functions
// ====================

/**
 * Handle a player's move
 */
function handleMove(column) {
  if (!gameActive) return;
  if (!Number.isInteger(column) || column < 0 || column >= COLS) {
    return;
  }

  const tokenPlaced = dropToken(column);
  if (!tokenPlaced) {
    updateHeader("⚠️ Column is full. Try another!");
    setTimeout(() => {
      announceNextTurn();
    }, 1500);
    return;
  }

  winnerCells = [];
  const hasWinner = checkWin();
  const isTie = !hasWinner && checkTie();

  renderBoard();

  if (hasWinner) {
    gameActive = false;
    const winnerName = currentPlayer === "Y" ? "Yellow" : "Red";
    updateHeader(`🎉 ${winnerName} Wins! 🎉`);

    // Celebrate with a subtle effect
    setTimeout(() => {
      header.style.transform = "scale(1.05)";
      setTimeout(() => {
        header.style.transform = "scale(1)";
      }, 200);
    }, 100);
    return;
  }

  if (isTie) {
    gameActive = false;
    updateHeader("🤝 It's a Tie! Good Game!");
    return;
  }

  currentPlayer = currentPlayer === "Y" ? "R" : "Y";
  announceNextTurn();
}

/**
 * Reset the game to initial state
 */

/**
 * Reset the game to initial state
 */
function resetGame() {
  boardState = createEmptyBoard();
  currentPlayer = "Y";
  gameActive = true;
  winnerCells = [];
  header.style.transform = "scale(1)";
  renderBoard();
  announceNextTurn();
}

// ====================
// Event Listeners
// ====================

// Handle clicks on the game board
matrix.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  const column = Number.parseInt(cell.dataset.column, 10);
  if (Number.isNaN(column)) return;
  handleMove(column);
});

// Handle keyboard navigation on the game board
matrix.addEventListener("keydown", (event) => {
  const isActivationKey =
    event.key === "Enter" || event.key === " " || event.key === "Spacebar";
  if (!isActivationKey) return;
  const cell = event.target.closest(".cell");
  if (!cell) return;
  event.preventDefault();
  const column = Number.parseInt(cell.dataset.column, 10);
  if (Number.isNaN(column)) return;
  handleMove(column);
});

// Handle reset button
resetButton.addEventListener("click", resetGame);

// ====================
// Initialize Game
// ====================
renderBoard();
announceNextTurn();
