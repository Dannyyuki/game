const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const goalDisplay = document.getElementById('goal');

canvas.width = 800;
canvas.height = 600;

let rifle = { x: 100, y: 290, width: 100, height: 20 };
let bullets = [];
let birds = [];
let score = 0;
let gameInterval;
let timerInterval;
let moveDirection = null;
let birdSpeed = 4;  // Initial speed
let bulletSpeed = 20;  // Increased speed
let gameTime = 60;
let moveInterval;
let goalScore;

function createBird() {
    let size = 50;
    let x = canvas.width - size;
    let y = Math.random() * (canvas.height - size);
    birds.push({ x, y, size });
}

function drawRifle() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(rifle.x, rifle.y, rifle.width, rifle.height);
    ctx.fillStyle = 'grey';
    ctx.fillRect(rifle.x + rifle.width - 20, rifle.y + 5, 20, 10);
}

function drawBirds() {
    ctx.fillStyle = 'yellow';
    birds.forEach(bird => {
        ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
    });
}

function drawBullets() {
    ctx.fillStyle = 'black';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRifle();
    drawBirds();
    drawBullets();

    birds.forEach(bird => {
        bird.x -= birdSpeed;
    });

    bullets.forEach(bullet => {
        bullet.x += bulletSpeed;
    });

    bullets = bullets.filter(bullet => bullet.x < canvas.width);
    birds = birds.filter(bird => bird.x + bird.size > 0);

    checkCollision();

    if (birds.length < 3) {
        createBird();
    }

    if (gameTime <= 0) {
        endGame('Time is up! You failed to reach the goal.');
    }

    checkGameOver();
}

function moveRifle() {
    if (moveDirection === 'up' && rifle.y > 0) {
        rifle.y -= 10;
    } else if (moveDirection === 'down' && rifle.y < canvas.height - rifle.height) {
        rifle.y += 10;
    }
}

function shootBullet() {
    bullets.push({ x: rifle.x + rifle.width, y: rifle.y + rifle.height / 2, width: 10, height: 5 });
}

function checkCollision() {
    bullets.forEach(bullet => {
        birds.forEach((bird, birdIndex) => {
            if (
                bullet.x < bird.x + bird.size &&
                bullet.x + bullet.width > bird.x &&
                bullet.y < bird.y + bird.size &&
                bullet.y + bullet.height > bird.y
            ) {
                birds.splice(birdIndex, 1);
                score += 10;
                scoreDisplay.textContent = score;
                if (score % 20 === 0) {
                    birdSpeed += 2;  // Increase bird speed every 20 points
                }
                if (score >= goalScore) {
                    endGame('Congratulations! You reached the goal.');
                }
            }
        });
    });
}

function checkGameOver() {
    birds.forEach(bird => {
        if (
            bird.x < rifle.x + rifle.width &&
            bird.x + bird.size > rifle.x &&
            bird.y < rifle.y + rifle.height &&
            bird.y + bird.size > rifle.y
        ) {
            endGame('Game Over! A bird hit you.');
        }
    });
}

function endGame(message) {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    alert(message + ' Final score: ' + score);
}

function startGame() {
    score = 0;
    gameTime = 60;
    bullets = [];
    birds = [];
    moveDirection = null;
    birdSpeed = 4;
    goalScore = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = gameTime;
    goalDisplay.textContent = goalScore;
    gameInterval = setInterval(update, 30);  // Increased update frequency
    timerInterval = setInterval(updateTimer, 1000);
    update();
}

function updateTimer() {
    gameTime--;
    timeDisplay.textContent = gameTime;
    if (gameTime <= 0) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert('遊戲結束！最終得分：' + score);
    }
}

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp') {
        moveDirection = 'up';
        if (!moveInterval) {
            moveInterval = setInterval(moveRifle, 30);
        }
    } else if (event.key === 'ArrowDown') {
        moveDirection = 'down';
        if (!moveInterval) {
            moveInterval = setInterval(moveRifle, 30);
        }
    } else if (event.key === ' ') {
        shootBullet();
    }
});

document.addEventListener('keyup', event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        moveDirection = null;
        clearInterval(moveInterval);
        moveInterval = null;
    }
});
