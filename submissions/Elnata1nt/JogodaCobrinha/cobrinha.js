const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 1000;

const snake1 = {
    body: [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 }
    ],
    dx: 10,
    dy: 0,
    color: getRandomColor(),
    size: 10,
    score: 0
};

const snake2 = {
    body: [
        { x: 100, y: 100 },
        { x: 90, y: 100 },
        { x: 80, y: 100 },
        { x: 70, y: 100 },
        { x: 60, y: 100 }
    ],
    dx: 10,
    dy: 0,
    color: getRandomColor(),
    size: 10,
    score: 0
};

let foodX;
let foodY;
let changingDirection = false;
let gameEnded = false;
let gameStarted = false;
let startTime;
let elapsedTime = 0;
let gameMode = 'solo'; // Adiciona o modo de jogo

document.addEventListener('keydown', changeDirection);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    gameMode = document.getElementById('gameMode').value; // Obtém o modo de jogo selecionado
    startTime = Date.now();
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'block';

    // Ajusta a exibição da pontuação da Cobra 2 com base no modo de jogo
    if (gameMode === 'solo') {
        document.getElementById('score2').style.display = 'none';
    } else {
        document.getElementById('score2').style.display = 'block';
    }

    main();
    createFood();
    setInterval(createFood, 8000);
}

function main() {
    if (gameEnded) return;

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake(snake1);
        drawSnake(snake1);

        if (gameMode === 'battle') {
            advanceSnake(snake2);
            drawSnake(snake2);

            if (didSnakeHitWall(snake2)) {
                resetSnake(snake2);
            }

            if (didSnakesCollide(snake1, snake2)) {
                resetSnake(snake1);
                resetSnake(snake2);
            }
        }

        if (didSnakeHitWall(snake1)) {
            resetSnake(snake1);
        }

        main();

        document.getElementById('score1').textContent = `Pontuação Cobra 1: ${snake1.score}`;
        if (gameMode === 'battle') {
            document.getElementById('score2').textContent = `Pontuação Cobra 2: ${snake2.score}`;
        }

        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time').textContent = `Tempo: ${elapsedTime} segundos`;
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.strokestyle = 'black';

    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake(snake) {
    ctx.fillStyle = snake.color;
    ctx.strokestyle = 'darkgreen';

    snake.body.forEach(part => {
        drawSnakePart(part, snake.size);
    });
}

function drawSnakePart(snakePart, size) {
    ctx.fillRect(snakePart.x, snakePart.y, size, size);
    ctx.strokeRect(snakePart.x, snakePart.y, size, size);
}

function advanceSnake(snake) {
    const head = { x: snake.body[0].x + snake.dx, y: snake.body[0].y + snake.dy };
    snake.body.unshift(head);

    const didEatFood = snake.body[0].x === foodX && snake.body[0].y === foodY;
    if (didEatFood) {
        snake.score += 1;
        createFood();
    } else {
        snake.body.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 65; // A
    const RIGHT_KEY = 68; // D
    const UP_KEY = 87; // W
    const DOWN_KEY = 83; // S    
    const LEFT_ARROW = 37;
    const UP_ARROW = 38;
    const RIGHT_ARROW = 39;
    const DOWN_ARROW = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY && snake1.dx !== 10) {
        snake1.dx = -10;
        snake1.dy = 0;
    } else if (keyPressed === UP_KEY && snake1.dy !== 10) {
        snake1.dx = 0;
        snake1.dy = -10;
    } else if (keyPressed === RIGHT_KEY && snake1.dx !== -10) {
        snake1.dx = 10;
        snake1.dy = 0;
    } else if (keyPressed === DOWN_KEY && snake1.dy !== -10) {
        snake1.dx = 0;
        snake1.dy = 10;
    }

    if (gameMode === 'battle') {
        if (keyPressed === LEFT_ARROW && snake2.dx !== 10) {
            snake2.dx = -10;
            snake2.dy = 0;
        } else if (keyPressed === UP_ARROW && snake2.dy !== 10) {
            snake2.dx = 0;
            snake2.dy = -10;
        } else if (keyPressed === RIGHT_ARROW && snake2.dx !== -10) {
            snake2.dx = 10;
            snake2.dy = 0;
        } else if (keyPressed === DOWN_ARROW && snake2.dy !== -10) {
            snake2.dx = 0;
            snake2.dy = 10;
        }
    }
}

function createFood() {
    foodX = Math.round((Math.random() * (canvas.width - 10)) / 10) * 10;
    foodY = Math.round((Math.random() * (canvas.height - 10)) / 10) * 10;

    [snake1, snake2].forEach(snake => {
        snake.body.forEach(part => {
            const foodIsOnSnake = part.x === foodX && part.y === foodY;
            if (foodIsOnSnake) createFood();
        });
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokestyle = 'darkred';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function didSnakeHitWall(snake) {
    const hitLeftWall = snake.body[0].x < 0;
    const hitRightWall = snake.body[0].x >= canvas.width;
    const hitTopWall = snake.body[0].y < 0;
    const hitBottomWall = snake.body[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function didSnakesCollide(snake1, snake2) {
    for (let i = 0; i < snake1.body.length; i++) {
        if (snake1.body[i].x === snake2.body[0].x && snake1.body[i].y === snake2.body[0].y) {
            return true;
        }
    }
    for (let i = 0; i < snake2.body.length; i++) {
        if (snake2.body[i].x === snake1.body[0].x && snake2.body[i].y === snake1.body[0].y) {
            return true;
        }
    }
    return false;
}

function resetSnake(snake) {
    snake.body.length = 0;
    if (snake === snake1) {
        snake.body.push({ x: 200, y: 200 });
        snake.body.push({ x: 190, y: 200 });
        snake.body.push({ x: 180, y: 200 });
        snake.body.push({ x: 170, y: 200 });
        snake.body.push({ x: 160, y: 200 });
    } else if (snake === snake2) {
        snake.body.push({ x: 100, y: 100 });
        snake.body.push({ x: 90, y: 100 });
        snake.body.push({ x: 80, y: 100 });
        snake.body.push({ x: 70, y: 100 });
        snake.body.push({ x: 60, y: 100 });
    }
    snake.dx = 10;
    snake.dy = 0;
}

function resetGame() {
    snake1.score = 0;
    snake2.score = 0;
    resetSnake(snake1);
    resetSnake(snake2);
    createFood();
}

function restartGame() {
    gameEnded = false;
    elapsedTime = 0;
    startTime = Date.now();
    resetGame();
    document.getElementById('score1').textContent = `Pontuação Cobra 1: ${snake1.score}`;
    document.getElementById('score2').textContent = `Pontuação Cobra 2: ${snake2.score}`;
    document.getElementById('time').textContent = `Tempo: ${elapsedTime} segundos`;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
