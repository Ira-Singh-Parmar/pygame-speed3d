const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const carImg = new Image();
carImg.src = 'assets/car.png';
const obstacleImg = new Image();
obstacleImg.src = 'assets/obstacle.png';

// Game variables
let car = { x: 375, y: 500, width: 50, height: 100, speed: 7 };
let obstacles = [];
let obstacleSpeed = 5;
let score = 0;

// Lanes
const LANES = [200, 375, 550];

// Input handling
let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Spawn obstacles every 2 seconds
setInterval(() => {
    const laneX = LANES[Math.floor(Math.random() * LANES.length)];
    obstacles.push({ x: laneX, y: -100, width: 50, height: 100 });
}, 2000);

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw road
    ctx.fillStyle = '#555';
    ctx.fillRect(200, 0, 400, canvas.height);

    // Lane markings
    ctx.fillStyle = 'white';
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.fillRect(400 - 5, i, 10, 20);
    }

    // Move car
    if (keys['ArrowLeft'] && car.x > 200) car.x -= car.speed;
    if (keys['ArrowRight'] && car.x < 200 + 400 - 50) car.x += car.speed;

    // Draw car
    ctx.drawImage(carImg, car.x, car.y, car.width, car.height);

    // Move and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];

        // Simulate 3D perspective
        const scale = 1 + (obs.y / canvas.height) * 0.5;
        const obsWidth = obs.width * scale;
        const obsHeight = obs.height * scale;
        const obsX = obs.x - (obsWidth - obs.width) / 2;
        const obsY = obs.y;

        ctx.drawImage(obstacleImg, obsX, obsY, obsWidth, obsHeight);

        // Collision detection
        if (!(car.x + car.width < obsX || car.x > obsX + obsWidth || car.y + car.height < obsY || car.y > obsY + obsHeight)) {
            alert(`Game Over! Score: ${score}`);
            obstacles = [];
            score = 0;
            car.x = 375;
        }

        obs.y += obstacleSpeed;

        // Remove off-screen obstacles
        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
        }
    }

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(update);
}

// Start the game
update();
