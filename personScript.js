const board = document.getElementById("board"),
      statusText = document.getElementById("status"),
      resetButton = document.getElementById("reset"),
      mainMenuButton = document.getElementById("main-menu"),
      winningLine = document.getElementById("winning-line");

let currentPlayer = "X",
    gameBoard = Array(9).fill(""),
    isGameActive = true;

const winningConditions = [
    [0, 1, 2], 
    [3, 4, 5], 
    [6, 7, 8], 
    [0, 3, 6], 
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6]             
];

const images = { "X": "./Assets/wrong.png", "O": "./Assets/circle.png" };

// Handle clicks 
board.addEventListener("click", (e) => {
    if (!isGameActive) return; // makes clicks disable if the game is over

    const cell = e.target.closest(".cell");
    if (!cell || gameBoard[cell.dataset.index]) return; // Ignore invalid clicks

    placeSymbol(cell.dataset.index, currentPlayer);
    if (!checkWinner()) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s Turn`;
    }
});

function placeSymbol(index, symbol) {
    gameBoard[index] = symbol;
    const img = document.createElement("img");
    img.src = images[symbol];
    document.querySelector(`[data-index="${index}"]`).appendChild(img);
}

// Check for winner or draw
function checkWinner() {
    for (let [a, b, c] of winningConditions) {
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            statusText.textContent = `Player ${gameBoard[a]} Wins!`;
            isGameActive = false;
            drawWinningLine(a, c);
            return setTimeout(() => location.reload(), 2500), true;
        }
    }

    if (!gameBoard.includes("")) {
        statusText.textContent = "It's a Draw!";
        isGameActive = false;
        setTimeout(() => location.reload(), 2500);
        return true;
    }
    return false;
}

// Draw winning line
function drawWinningLine(startIdx, endIdx) {
    let { left: x1, top: y1, width: w } = document.querySelector(`[data-index="${startIdx}"]`).getBoundingClientRect(),
        { left: x2, top: y2 } = document.querySelector(`[data-index="${endIdx}"]`).getBoundingClientRect(),
        { left: boardX, top: boardY } = board.getBoundingClientRect();

    Object.assign(winningLine.style, {
        width: `${Math.hypot(x2 - x1, y2 - y1)}px`,
        transform: `translate(${x1 - boardX + w / 2}px, ${y1 - boardY + w / 2}px) rotate(${Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI)}deg)`
    });
}

// Reset & Main Menu Buttons
[resetButton, mainMenuButton].forEach(btn => 
    btn.addEventListener("click", () => btn.id === "main-menu" ? window.location.href = "index.html" : location.reload())
);