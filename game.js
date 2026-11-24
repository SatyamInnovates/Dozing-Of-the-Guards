const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playerSprite = new Image();
let currentFrame = 0;
let frameTimer = 0;
const frameDuration = 125;
const background = new Image();

background.src = "assets/DozeGuard-background.png";
playerSprite.src = "assets/mech-bot/mech-bot-idle.png";

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


const player = {
    x: 120,
    y: canvas.height - 280 - 10,
    size: 280,
    speed: 4
};
const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

function update() {
    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
    }

    
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (background.complete && background.naturalWidth > 0) {
        ctx.drawImage(
            background,
            0, 0,
            canvas.width,
            canvas.height
        );
    }

    ctx.imageSmoothingEnabled = false;

    if (playerSprite.complete && playerSprite.naturalWidth > 0) {
        const frameX = (currentFrame % 8) * 256;
        const frameY = Math.floor(currentFrame / 8) * 256;

        ctx.drawImage(
            playerSprite,
            frameX, frameY,
            256, 256,
            player.x, player.y,
            player.size, player.size
        );
    }
}


function animateIdle(deltaTime) {
    frameTimer += deltaTime;


    if (frameTimer >= frameDuration) {
        currentFrame = (currentFrame + 1) % 10;
        frameTimer -= frameDuration;


    }
}







function gameLoop(timestamp) {
    if (!gameLoop.lastTime) {
        gameLoop.lastTime = timestamp;
    }

    const deltaTime = timestamp - gameLoop.lastTime;
    gameLoop.lastTime = timestamp;

    animateIdle(deltaTime);

    update();
    draw();

    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);