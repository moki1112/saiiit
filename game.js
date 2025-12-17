// ===== НАЛАШТУВАННЯ =====
const gameArea = document.querySelector('.game-area');
const car = document.querySelector('.car');
const scoreEl = document.getElementById('score');
console.log('game-area:', document.querySelector('.game-area'));
console.log('car:', document.querySelector('.car'));
const restartBtn = document.getElementById('restart');

let score = 0;
let speed = 3;
let gameOver = false;

// ===== КЕРУВАННЯ =====
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    const left = car.offsetLeft;

    if (e.key === 'ArrowLeft' && left > 0) {
        car.style.left = left - 20 + 'px';
    }

    if (e.key === 'ArrowRight' && left < 360) {
        car.style.left = left + 20 + 'px';
    }
});

// ===== ОЧКИ =====
const scoreTimer = setInterval(() => {
    if (!gameOver) {
        score++;
        scoreEl.textContent = score;

        if (score % 20 === 0) speed++;
    }
}, 500);

// ===== ПЕРЕШКОДИ =====
function spawnObstacle() {
    if (gameOver) return;

    const obs = document.createElement('div');
    obs.className = 'obstacle';
    obs.style.left = Math.random() * 360 + 'px';
    gameArea.appendChild(obs);

    const moveTimer = setInterval(() => {
        if (gameOver) {
            clearInterval(moveTimer);
            obs.remove();
            return;
        }

        obs.style.top = obs.offsetTop + speed + 'px';

        if (checkCollision(car, obs)) {
            gameOver = true;
            alert(`Game Over!\nОчки: ${score}`);
            clearInterval(scoreTimer);
        }

        if (obs.offsetTop > 600) {
            obs.remove();
            clearInterval(moveTimer);
        }

    }, 20);
}

setInterval(spawnObstacle, 1500);

// ===== КОЛІЗІЯ =====
function checkCollision(a, b) {
    const r1 = a.getBoundingClientRect();
    const r2 = b.getBoundingClientRect();

    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}

// ===== RESTART =====
restartBtn.addEventListener('click', () => {
    location.reload();
});
