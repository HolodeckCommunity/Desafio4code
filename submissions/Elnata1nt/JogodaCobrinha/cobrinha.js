const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
];

let dx = 10;
let dy = 0;
let foodX;
let foodY;
let heartX;
let heartY;
let heartPresent = false;
let heartTimer;
let changingDirection = false;
let lives = 3;
let gameEnded = false;
let gameStarted = false;
let snakeColor = getRandomColor();

document.addEventListener('keydown', changeDirection);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'block';
    main();
    createFood();
    setInterval(createFood, 3000); // Change food position every 3 seconds
}

function main() {
    if (gameEnded) return;

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        if (heartPresent) {
            drawHeart();
        }
        advanceSnake();
        drawSnake();

        if (didGameEnd()) {
            if (lives > 1) {
                lives--;
                resetGame();
            } else {
                gameEnded = true;
                displayGameOver();
            }
        } else {
            main();
        }

        document.getElementById('lives').textContent = `Vidas: ${lives}`;
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.strokestyle = 'black';

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = snakeColor;
    ctx.strokestyle = 'darkgreen';

    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        createFood();
    } else {
        snake.pop();
    }

    if (heartPresent && snake[0].x === heartX && snake[0].y === heartY) {
        lives++;
        heartPresent = false;
        clearTimeout(heartTimer);
    }

    if (!heartPresent && Math.random() < 0.01) {
        createHeart();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 65; // A
    const RIGHT_KEY = 68; // D
    const UP_KEY = 87; // W
    const DOWN_KEY = 83; // S    

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function createFood() {
    foodX = Math.round((Math.random() * (canvas.width - 10)) / 10) * 10;
    foodY = Math.round((Math.random() * (canvas.height - 10)) / 10) * 10;

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x === foodX && part.y === foodY;
        if (foodIsOnSnake) createFood();
    });
}

function createHeart() {
    heartX = Math.round((Math.random() * (canvas.width - 10)) / 10) * 10;
    heartY = Math.round((Math.random() * (canvas.height - 10)) / 10) * 10;
    heartPresent = true;

    heartTimer = setTimeout(() => {
        heartPresent = false;
    }, 3000); //5 seconds

    snake.forEach(function isHeartOnSnake(part) {
        const heartIsOnSnake = part.x === heartX && part.y === heartY;
        if (heartIsOnSnake) createHeart();
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function drawHeart() {
    ctx.fillStyle = 'pink';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(heartX, heartY, 10, 10);
    ctx.strokeRect(heartX, heartY, 10, 10);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function displayGameOver() {
    ctx.font = '50px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Game Over', canvas.width / 6.5, canvas.height / 2);
}

function resetGame() {
    dx = 10;
    dy = 0;
    snake.length = 0;
    snake.push({ x: 200, y: 200 });
    snake.push({ x: 190, y: 200 });
    snake.push({ x: 180, y: 200 });
    snake.push({ x: 170, y: 200 });
    snake.push({ x: 160, y: 200 });
    createFood();
    snakeColor = getRandomColor(); // Change the snake color
    main();
}

function restartGame() {
    lives = 3;
    gameEnded = false;
    snakeColor = getRandomColor(); // Change the snake color on restart
    resetGame();
    document.getElementById('lives').textContent = `Vidas: ${lives}`;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
