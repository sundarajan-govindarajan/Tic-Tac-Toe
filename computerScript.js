const cells = document.querySelectorAll(".cell");
 statusText = document.getElementById("status");
 resetButton = document.getElementById("reset");
 mainMenuButton = document.getElementById("main-menu");
 symbolSelection = document.getElementById("symbol-selection");
 gameScreen = document.getElementById("game-screen");
 chooseX = document.getElementById("chooseX");
 chooseO = document.getElementById("chooseO");
 board = document.getElementById("board");

// Create Winning Line
const winningLine = document.createElement("div");
winningLine.classList.add("line");
board.appendChild(winningLine);

let playerSymbol = "X";
let computerSymbol = "O";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

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

const images = {
    "X": "./Assets/wrong.png",
    "O": "./Assets/circle.png"
};

// Game Starting Function
function startGame(playerChoice) {
    playerSymbol = playerChoice;
    computerSymbol = playerChoice === "X" ? "O" : "X";
    symbolSelection.style.display = "none";
    gameScreen.style.display = "block";
}

chooseX.addEventListener("click", () => startGame("X"));
chooseO.addEventListener("click", () => startGame("O"));

// Prevent screen touching
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.getAttribute("data-index");

        if (gameBoard[index] !== "" || !isGameActive) return;

        placeSymbol(index, playerSymbol);

        if (checkWinner()) return;

        setTimeout(computerMove);
    });
});

// Place Symbol
function placeSymbol(index, symbol) {
    gameBoard[index] = symbol;
    const img = document.createElement("img");
    img.src = images[symbol];
    cells[index].appendChild(img);
}

// Computer Move
function computerMove() {
    if (!isGameActive) return;

    let availableCells = gameBoard
        .map((val, idx) => (val === "" ? idx : null))
        .filter(val => val !== null);

    if (availableCells.length === 0) return;

    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    placeSymbol(randomIndex, computerSymbol);

    checkWinner();
}

// Check Winner
function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            statusText.textContent = `${gameBoard[a]} Wins!`;
            drawWinningLine(a, c);
            setTimeout(() => location.reload(), 2000);
            isGameActive = false;
            return true;
        }
    }

    if (!gameBoard.includes("")) {
        statusText.textContent = "It's a Draw!";
        setTimeout(() => location.reload(), 2000);
        isGameActive = false;
    }
    return false;
}

// Draw Winning Line
function drawWinningLine(startIdx, endIdx) {
    const startCell = cells[startIdx].getBoundingClientRect();
    const endCell = cells[endIdx].getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const x1 = startCell.left + startCell.width / 2 - boardRect.left;
    const y1 = startCell.top + startCell.height / 2 - boardRect.top;
    const x2 = endCell.left + endCell.width / 2 - boardRect.left;
    const y2 = endCell.top + endCell.height / 2 - boardRect.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    const winningLine = document.getElementById("winning-line"); // Use existing line

    winningLine.style.width = "0";
    winningLine.style.display = "block";
    winningLine.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;

    setTimeout(() => {
        winningLine.style.width = `${length}px`; // Animate width
    }, 50);
}

// Reset and Main Menu Buttons
resetButton.addEventListener("click", () => location.reload());
mainMenuButton.addEventListener("click", () => window.location.href = "index.html");

document.getElementById("go-back-menu").addEventListener("click", () => {
    window.location.href = "index.html";
});