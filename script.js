const gameArea = document.getElementById('game-area');
let snake = [{ x: 10, y: 10 }];
let food = { x: 100, y: 100 };
let direction = 'right';
let gamePaused = false;
let score = 0;

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

    if (newHead.x < 0 || newHead.x >= gameArea.clientWidth || newHead.y < 0 || newHead.y >= gameArea.clientHeight) {
        return;
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
}

function handleTouchStart(event) {
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    const deltaX = x - snake[0].x;
    const deltaY = y - snake[0].y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
    } else {
        direction = deltaY > 0 ? 'down' : 'up';
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

    const scoreElement = document.getElementById('score');
    scoreElement.innerText = 'Score: ' + score;
}

document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
        case ' ':
            togglePause();
            break;
        default:
            break;
    }
});

function gameLoop() {
    update();
    draw();
}

setInterval(gameLoop, 1000 / 10);