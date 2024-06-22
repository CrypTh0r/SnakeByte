const gameArea = document.getElementById('game-area');
let snake = [{ x: 10, y: 10 }];
let food = { x: 100, y: 100 };
let direction = 'right';
let gamePaused = false;
let score = 0;
let highScore = 0;
let intervalSpeed = 11; // Initial interval speed
let speedIncrease = -0.1; // Amount to decrease interval speed by

let gameInterval = setInterval(gameLoop, 1000 / intervalSpeed); // Initial game interval

function draw() {
    gameArea.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.className = 'snake';
        snakeElement.style.left = segment.x + 'px';
        snakeElement.style.top = segment.y + 'px';
        gameArea.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.className = 'food';
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    gameArea.appendChild(foodElement);
}

function update() {
    if (gamePaused) {
        return;
    }

    let newHead;
    switch (direction) {
        case 'up':
            newHead = { x: snake[0].x, y: snake[0].y - 10 };
            break;
        case 'down':
            newHead = { x: snake[0].x, y: snake[0].y + 10 };
            break;
        case 'left':
            newHead = { x: snake[0].x - 10, y: snake[0].y };
            break;
        case 'right':
            newHead = { x: snake[0].x + 10, y: snake[0].y };
            break;
        default:
            newHead = { x: snake[0].x, y: snake[0].y };
            break;
    }

    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            gamePaused = true;
            document.getElementById('game-over').classList.add('show');
            document.getElementById('current-score').innerText = score;
            highScore = Math.max(score, highScore);
            document.getElementById('high-score').innerText = highScore;
            return;
        }
    }

    if (newHead.x < 0) {
        newHead.x = gameArea.clientWidth - 10;
    } else if (newHead.x >= gameArea.clientWidth) {
        newHead.x = 0;
    }
    if (newHead.y < 0) {
        newHead.y = gameArea.clientHeight - 10;
    } else if (newHead.y >= gameArea.clientHeight) {
        newHead.y = 0;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
        updateScore();
        food.x = Math.floor(Math.random() * (gameArea.clientWidth - 20) / 10) * 10;
        food.y = Math.floor(Math.random() * (gameArea.clientHeight - 20) / 10) * 10;
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    score++;
    scoreElement.innerText = 'Score: ' + score;

    if (score % 1 === 0) {
        intervalSpeed -= speedIncrease;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 1000 / intervalSpeed);
    }
}

function handleTouchStart(event) {
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    const deltaX = x - snake[0].x;
    const deltaY = y - snake[0].y;

    let newDirection;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newDirection = deltaX > 0 ? 'right' : 'left';
    } else {
        newDirection = deltaY > 0 ? 'down' : 'up';
    }

    if (newDirection && newDirection !== getOppositeDirection(direction)) {
        direction = newDirection;
    }
}

function togglePause() {
    gamePaused = !gamePaused;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 100, y: 100 };
    direction = 'right';
    score = 0;
    gamePaused = false;
    intervalSpeed = 12; // Reset interval speed back to 12

    const scoreElement = document.getElementById('score');
    scoreElement.innerText = 'Score: ' + score;

    document.getElementById('game-over').classList.remove('show');

    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000 / intervalSpeed); // Set the game interval with the original speed
}

function getOppositeDirection(dir) {
    switch (dir) {
        case 'up':
            return 'down';
        case 'down':
            return 'up';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        default:
            return null;
    }
}

document.addEventListener('keydown', (event) => {
    let newDirection;
    switch (event.key) {
        case 'ArrowUp':
            newDirection = 'up';
            break;
        case 'ArrowDown':
            newDirection = 'down';
            break;
        case 'ArrowLeft':
            newDirection = 'left';
            break;
        case 'ArrowRight':
            newDirection = 'right';
            break;
        case ' ':
            togglePause();
            break;
        default:
            break;
    }

    if (newDirection && newDirection !== getOppositeDirection(direction)) {
        direction = newDirection;
    }
});

document.addEventListener('touchstart', handleTouchStart);

function gameLoop() {
    update();
    draw();
}
