const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playerSprite = new Image();
let currentFrame = 0;
let frameTimer = 0;
const frameDuration = 125;
let gameState = "menu";
const background = new Image();
let buttonx;
let buttony;
const buttonWidth = 240;
const buttonHeight = 55;
let linkX;
let linkY;
const linkWidth = 180;
const linkHeight = 25;

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
    if (gameState === "menu"){
        drawMenu()
    }
}



function animateIdle(deltaTime) {
    frameTimer += deltaTime;


    if (frameTimer >= frameDuration) {
        currentFrame = (currentFrame + 1) % 10;
        frameTimer -= frameDuration;


    }
}


function drawMenu() {
    const menux = canvas.width * 0.65;
    const menuy = canvas.height * 0.35;
    const glow = 15 + Math.sin(Date.now() / 180) * 8;
    ctx.font = "bold 64px Arial";
    ctx.fillStyle = "#00aaff";
    ctx.textAlign = "center";
    ctx.fillText("DOZEGUARD" ,menux,menuy)
    buttonx = menux - 120;
    buttony = menuy + 70;

    ctx.shadowBlur = isButtonHovered ? glow : 0;
    ctx.shadowColor = "greenyellow";
    ctx.fillStyle = "#087cff";
    ctx.fillRect(buttonx, buttony, buttonWidth, buttonHeight);
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    ctx.fillText(
    "START GAME",
    buttonx + buttonWidth / 2,
    buttony + 36
    );
    ctx.shadowBlur = 0;
    ctx.font = "14px Arial";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";

    ctx.fillText(
        "An interactive promotional experience by DozeGuard",
        menux,
        buttony+ 95
    );
    linkX = menux - linkWidth / 2;
    linkY = buttony + 113;
    ctx.font = "14px Arial";
    ctx.fillStyle = "#38bdf8";
    ctx.shadowBlur = isLinkHovered ? glow : 0;
    ctx.shadowColor = "greenyellow";
    ctx.fillText("Discover DozeGuard ↗", linkX + linkWidth / 2, linkY + linkHeight / 2);
    ctx.shadowBlur = 0;   
}





let mousex;
let mousey;
let isButtonHovered = false;
let isLinkHovered = false;


canvas.addEventListener("mousemove",(e) => {

    mousex = e.offsetX;
    mousey = e.offsetY;
})


function checkhover(){
    isButtonHovered = false;
    isLinkHovered = false;
    if(mousex >= buttonx && mousex <= buttonx + buttonWidth && mousey >= buttony && mousey <= buttony + buttonHeight){
        isButtonHovered = true;
    }
    if (mousex >= linkX && mousex <= linkX + linkWidth && mousey >= linkY && mousey <= linkY + linkHeight){
        isLinkHovered = true;
    }
}


canvas.addEventListener("click" ,(e) => {
    mousex = e.offsetX
    mousey = e.offsetY

    if (mousex >= buttonx && mousex <= buttonx + buttonWidth && mousey >= buttony && mousey <= buttony + buttonHeight){
        gameState = "playing"
    };

    if (mousex >= linkX && mousex <= linkX + linkWidth && mousey >= linkY && mousey <= linkY + linkHeight){
        window.open("https://dozeguard.vercel.app/","_blank");
    }
})




function gameLoop(timestamp) {
    if (!gameLoop.lastTime) {
        gameLoop.lastTime = timestamp;
    }

    const deltaTime = timestamp - gameLoop.lastTime;
    gameLoop.lastTime = timestamp;

    if (gameState === "playing") {
        update();
    }

    animateIdle(deltaTime);
    checkhover();
    draw();
    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);

