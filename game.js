const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let chicken = {
    x: 50,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
};

let eggs = [];
let obstacles = [];
let score = 0;
let gameRunning = false;
let letterSpeed = 1;
let obstacleSpeed = 2;
let difficulty = 'None';
let gameLoopId; // Store the requestAnimationFrame ID

const eggImage = new Image();
eggImage.src = 'egg.png'; // Path to your egg image

const chickenImage = new Image();
chickenImage.src = 'chicken.png'; // Path to your chicken image

const snakeImage = new Image();
snakeImage.src = 'snake.png'; // Path to your snake image

const eggSize = { width: 30, height: 30 }; // Size of the egg
const snakeSize = { width: 80, height: 40 }; // Size of the snake

const snakeHitboxSize = { width: 40, height: 20 }; // Smaller hitbox size for the snake

const difficultyModal = document.getElementById('difficultyModal');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreElement = document.getElementById('finalScore');
const retryBtn = document.getElementById('retryBtn');
const difficultyText = document.getElementById('difficultyText');
const reselectDifficultyBtn = document.getElementById('reselectDifficultyBtn');

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' || e.key.toLowerCase() === 'd') {
        chicken.dx = chicken.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left' || e.key.toLowerCase() === 'a') {
        chicken.dx = -chicken.speed;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right' ||
        e.key === 'ArrowLeft' || e.key === 'Left' ||
        e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'd') {
        chicken.dx = 0;
    }
}

function moveChicken() {
    chicken.x += chicken.dx;

    if (chicken.x < 0) {
        chicken.x = 0;
    }

    if (chicken.x + chicken.width > canvas.width) {
        chicken.x = canvas.width - chicken.width;
    }
}

function drawChicken() {
    ctx.drawImage(chickenImage, chicken.x, chicken.y, chicken.width, chicken.height);
}

function generateEgg() {
    const x = Math.random() * (canvas.width - eggSize.width);
    const y = -eggSize.height;
    eggs.push({ x, y, speed: letterSpeed, width: eggSize.width, height: eggSize.height });
}

function drawEgg(egg) {
    ctx.drawImage(eggImage, egg.x, egg.y, egg.width, egg.height);
}

function updateEggs() {
    eggs.forEach((egg, index) => {
        egg.y += egg.speed;

        // Remove egg if it goes off-screen and generate a new one
        if (egg.y > canvas.height) {
            eggs.splice(index, 1);
            generateEgg();
        }

        // Collision detection with chicken
        if (
            egg.y + egg.height > chicken.y &&
            egg.x + egg.width > chicken.x &&
            egg.x < chicken.x + chicken.width
        ) {
            // Egg collected
            eggs.splice(index, 1);
            score++;
            generateEgg(); // Generate a new egg when one is collected
        }

        // Draw each egg
        drawEgg(egg);
    });
}

function generateObstacle() {
    const x = Math.random() * (canvas.width - snakeSize.width);
    const y = -snakeSize.height;
    obstacles.push({ x, y, width: snakeSize.width, height: snakeSize.height, speed: obstacleSpeed });
}

function drawObstacle(obstacle) {
    ctx.drawImage(snakeImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function updateObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacle.speed;

        // Remove obstacle if it goes off-screen and generate a new one
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            generateObstacle();
        }

        // Smaller hitbox collision detection with chicken
        const hitbox = {
            x: obstacle.x + (obstacle.width - snakeHitboxSize.width) / 2,
            y: obstacle.y + (obstacle.height - snakeHitboxSize.height) / 2,
            width: snakeHitboxSize.width,
            height: snakeHitboxSize.height
        };

        if (
            hitbox.y + hitbox.height > chicken.y &&
            hitbox.x + hitbox.width > chicken.x &&
            hitbox.x < chicken.x + chicken.width
        ) {
            // Collision with snake
            gameOver();
        }

        // Draw each obstacle
        drawObstacle(obstacle);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
    ctx.fillText('Difficulty: ' + difficulty, canvas.width - 150, 20);
}

function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverModal.style.display = 'block';
}

function resetGame() {
    eggs = [];
    obstacles = [];
    score = 0;
    letterSpeed = difficulty === 'Easy' ? 1 : difficulty === 'Normal' ? 2 : 3;
    obstacleSpeed = difficulty === 'Easy' ? 2 : difficulty === 'Normal' ? 4 : 6;
    gameRunning = true;
    difficultyText.textContent = difficulty;

    // Generate initial eggs and obstacles
    for (let i = 0; i < 3; i++) {
        generateEgg();
        generateObstacle();
    }
}

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveChicken();
        updateEggs();
        updateObstacles();
        drawChicken();
        drawScore();
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

function stopGameLoop() {
    cancelAnimationFrame(gameLoopId);
}

document.getElementById('easyBtn').addEventListener('click', function() {
    difficulty = 'Easy';
    letterSpeed = 1;
    obstacleSpeed = 2;
    difficultyText.textContent = difficulty;
    difficultyModal.style.display = 'none';
    resetGame();
    gameLoop();
});

document.getElementById('normalBtn').addEventListener('click', function() {
    difficulty = 'Normal';
    letterSpeed = 2;
    obstacleSpeed = 4;
    difficultyText.textContent = difficulty;
    difficultyModal.style.display = 'none';
    resetGame();
    gameLoop();
});

document.getElementById('hardBtn').addEventListener('click', function() {
    difficulty = 'Hard';
    letterSpeed = 3;
    obstacleSpeed = 6;
    difficultyText.textContent = difficulty;
    difficultyModal.style.display = 'none';
    resetGame();
    gameLoop();
});

retryBtn.addEventListener('click', function() {
    resetGame(); // Preserve the difficulty level
    gameLoop();
    gameOverModal.style.display = 'none'; // Hide game over modal
});

reselectDifficultyBtn.addEventListener('click', function() {
    stopGameLoop(); // Pause the game
    difficultyModal.style.display = 'block';
    gameOverModal.style.display = 'none'; // Hide game over modal
});

// Show difficulty selection modal on page load
window.onload = function() {
    difficultyModal.style.display = 'block';
};

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
