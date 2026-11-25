const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playerSprite = new Image();
const walkingSprite = new Image();
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
let dialogueIndex = 0;
let storyStarted = false;

let walkFrame = 0;
let walkFrameTimer = 0;
const walkFrameDuration = 120;
let isWalking = false;
const dialogues = [
    "System:  An important task is running on the user's laptop",
    "System:  Oh no! It's a long task,and the user isn't near the laptop!!",
    "System:  Wait.. the laptop lid is closed too!! The task could be interrupted!!",
    "DozeGuard:  NO!! I'm here. Don't worry,system. Your session is under my protection!"
]




background.src = "assets/DozeGuard-background.png";
playerSprite.src = "assets/mech-bot/mech-bot-idle.png";
walkingSprite.src = "assets/mech-bot/mech-bot-march.png";
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


window.addEventListener("resize", resizeCanvas);

resizeCanvas();


const player = {
    x: 120,
    y: -280,
    size: 280,
    speed: 4
};
let facing = "right";
let botDropping = false;
const landingY = canvas.height - 280 - 10;
let jumpRemaining = 6;
const maxJumps = 2;
const  jumpStrength = 15;
let jumpVelocity = 0;
const gravity = 0.7;
const groundY = canvas.height - player.size - 10;

const keys = {};


window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.code === "Space" && !e.repeat && jumpRemaining > 0){
        jumpVelocity = -jumpStrength;
        jumpRemaining--;
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});


function update() {
    isWalking = false;
    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
        isWalking = true;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
        isWalking = true;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
        facing = 'left';
        isWalking = true;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
        facing = "right";
        isWalking = true;
    }

    
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

    player.y += jumpVelocity;
    jumpVelocity += gravity;

    if (player.y >= groundY){
        player.y = groundY;
        jumpVelocity = 0;
        jumpRemaining = maxJumps;
    }
}



function animateBotDrop(){
    if (botDropping){
        player.y += 12;

        if (player.y >= landingY){
            player.y =  landingY;
            botDropping = false;
        }
    }
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
        const activeSprite = isWalking ? walkingSprite : playerSprite;
        const activeFrame = isWalking ? walkFrame : currentFrame;
        const frameX = isWalking ? walkFrame * 256 : (currentFrame % 8) * 256;
        const frameY = isWalking ? 0 : Math.floor(currentFrame / 8) * 256;


        ctx.save();

        if (facing == "left"){
            ctx.translate(player.x + player.size, 0);
            ctx.scale(-1,1);

            ctx.drawImage(
                activeSprite,frameX,frameY,256,256,0,player.y,player.size,player.size
            );

        }else {
            ctx.drawImage(activeSprite,frameX, frameY,256, 256,player.x, player.y,player.size, player.size);
        }

        ctx.restore();


    }
    if (gameState === "menu"){
        drawMenu()
    }
    if (gameState === "story"){
        drawDialogue();
    }
}



function animateIdle(deltaTime) {
    frameTimer += deltaTime;


    if (frameTimer >= frameDuration) {
        currentFrame = (currentFrame + 1) % 10;
        frameTimer -= frameDuration;


    }
}


function animateWalk(deltatime){
    walkFrameTimer += deltatime;

    if(walkFrameTimer >= walkFrameDuration){
        walkFrame = (walkFrame + 1) % 8;
        walkFrameTimer -= walkFrameDuration;
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

function drawDialogue() {    
    ctx.fillStyle = "#071a32";
    ctx.fillRect(
        canvas.width * 0.1,
        canvas.height - 150,
        canvas.width * 0.7,
        110
    );

    ctx.font = "18px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    ctx.fillText(
        dialogues[dialogueIndex],
        canvas.width * 0.13,
        canvas.height - 100
    );
    ctx.font = "14px Arial";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";

    ctx.fillText(
        "CLICK TO CONTINUE →",
        canvas.width * 0.78,
        canvas.height - 55
    );

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
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


canvas.addEventListener("click", (e) => {
    const previousState = gameState;

    mousex = e.offsetX;
    mousey = e.offsetY;

    if (
        previousState === "menu" &&
        mousex >= buttonx &&
        mousex <= buttonx + buttonWidth &&
        mousey >= buttony &&
        mousey <= buttony + buttonHeight
    ) {
        gameState = "story";
        dialogueIndex = 0;
    }

    if (
        previousState === "menu" &&
        mousex >= linkX &&
        mousex <= linkX + linkWidth &&
        mousey >= linkY &&
        mousey <= linkY + linkHeight
    ) {
        window.open("https://dozeguard.vercel.app/", "_blank");
    }

    if (previousState === "story") {
        dialogueIndex++;
        if (dialogueIndex == 3){
            botDropping = true;
            player.y = -player.size
        }
        if (dialogueIndex >= dialogues.length) {
            gameState = "playing";
        }
    }
});




function gameLoop(timestamp) {
    if (!gameLoop.lastTime) {
        gameLoop.lastTime = timestamp;
    }

    const deltaTime = timestamp - gameLoop.lastTime;
    gameLoop.lastTime = timestamp;

    if (gameState === "playing") {
        update();
    }

    if (isWalking) {
        animateWalk(deltaTime);
    } else {
        animateIdle(deltaTime);
    }
    checkhover();
    animateBotDrop()
    draw();
    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);

