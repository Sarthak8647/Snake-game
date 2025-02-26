const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15;
let velocityX = 0, velocityY = 0;
let snakeBody = [[15, 15]]; // ✅ Fix: Initialize with one block
let setIntervalId;
let score = 0;

// Getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY === 0) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY === 0) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX === 0) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX === 0) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Mobile controls
controls.forEach(button => button.addEventListener("click", () => 
    changeDirection({ key: button.dataset.key })
));

const initGame = () => {
    if (gameOver) return handleGameOver();

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake eats the food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodX, foodY]); // ✅ Fix: Add new segment correctly
        score++;
        highScore = score > highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    
    // Move the snake
    snakeX += velocityX;
    snakeY += velocityY;

    // ✅ Fix: Shift snake body correctly
    snakeBody.unshift([snakeX, snakeY]);
    if (snakeBody.length > score + 1) snakeBody.pop();

    // Checking collision with wall
    if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30) {
        gameOver = true;
    }

    // Drawing the snake
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
};

// ✅ Fix: Start game only when key is pressed
const startGame = (e) => {
    if (velocityX === 0 && velocityY === 0) {
        changeDirection(e);
        setIntervalId = setInterval(initGame, 150);
        document.removeEventListener("keydown", startGame);
    }
};

updateFoodPosition();
document.addEventListener("keydown", startGame); // Start game on first key press
document.addEventListener("keydown", changeDirection);
