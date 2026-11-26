const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playerSprite = new Image();
const walkingSprite = new Image();
const teleportSprite = new Image();
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

let landingY ;
let groundY ;

let walkFrame = 0;
let walkFrameTimer = 0;
const walkFrameDuration = 80;
let isWalking = false;
let wasWalking = false;

const dialogues = [
    "System:  An important task is running on the user's laptop",
    "System:  Oh no! It's a long task,and the user isn't near the laptop!!",
    "System:  Wait.. the laptop lid is closed too!! The task could be interrupted!!",
    "DozeGuard:  NO!! I'm here. Don't worry,system. Your session is under my protection!"
]



let teleporting = false;
let teleportFrame = 0;
let teleportFrameTimer = 0;
let teleportTarget = null;
const teleportFrameDuration = 60;
let transitionTimer = 0;
const  transitionDuration =  150;


background.src = "assets/DozeGuard-background.png";
playerSprite.src = "assets/mech-bot/mech-bot-idle.png";
walkingSprite.src = "assets/mech-bot/mech-bot-march.png";
teleportSprite.src = "assets/mech-bot/dozeguard-teleport-sheet.png"



const backgroundMusic = new Audio("assets/sounds/background.mp3");
const ClickMusic = new Audio("assets/sounds/click.mp3");
const JumpMusic = new Audio("assets/sounds/jump.mp3") ;
const TeleportMusic = new Audio("assets/sounds/teleport.mp3")

backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;
ClickMusic.volume = 0.5;
JumpMusic.volume = 0.5;
TeleportMusic.volume = 0.5;



let maxhealth = 1000;
let health = maxhealth;




function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    landingY = canvas.height - 280 - 10;
    groundY = canvas.height - player.size - 10;
}




const player = {
    x: 120,
    y: -280,
    size: 280,
    speed: 10
};



let facing = "right";
let botDropping = false;
const maxJumps = 3;
let jumpRemaining = maxJumps;
const normalJumpStrength = 20;
const normalGravity = 1.1;
let jumpStrength = normalJumpStrength;
let gravity = normalGravity;
let jumpVelocity = 0;
let isJumping = false;
const platforms = [
    { x: 300, y: 500, width: 200, height: 20 },
    { x: 600, y: 400, width: 200, height: 20 },
    { x: 900, y: 300, width: 200, height: 20 }
];






const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.code === "Space" && !e.repeat && jumpRemaining > 0) {

        jumpVelocity = -jumpStrength;
        jumpRemaining--;
        isJumping = true;
        JumpMusic.currentTime = 0;
        JumpMusic.play();
    }

    if (e.key.toLowerCase() === "w" && !e.repeat && gameState === "playing"){
        teleport();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); 



function teleport(){
    let selectedPlatform = null;
    for(let i=0;platforms.length > i;i++){
        if(platforms[i].y < player.y && (selectedPlatform === null || platforms[i].y > selectedPlatform.y)){
            selectedPlatform = platforms[i];
        }
    }

    if (selectedPlatform !== null && !teleporting){
        teleportTarget = selectedPlatform;
        TeleportMusic.currentTime = 0.4;
        TeleportMusic.play()
        teleporting = true;
        teleportFrame = 0;
        teleportFrameTimer = 0;
    }
}






function update(deltaFrames) {
    if (teleporting) return;
    isWalking = false;
    if (keys["w"] || keys["arrowup"]){
        
        isWalking = true;
    }
    if (keys["s"] || keys["arrowdown"]){
    
        isWalking = true;
    }

  
    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed * deltaFrames;
        facing = 'left';
        isWalking = true;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed * deltaFrames;
        facing = "right";
        isWalking = true;
    }

    

    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

    if (!isJumping && player.y < groundY) {
        player.y += gravity * deltaFrames;
    }


    if (isJumping) {
        jumpVelocity += gravity * deltaFrames;
        player.y += jumpVelocity * deltaFrames;
        
        if (player.y >= groundY) {
            player.y = groundY;
            jumpVelocity = 0;
            jumpRemaining = maxJumps;
            isJumping = false;
        }
    }

    if (player.y >= groundY) {
        player.y = groundY;
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


function drawHealthBar() {
    const barWidth = 240;
    const barHeight = 65;
    const x = 30;
    const y = 30;

    ctx.fillStyle = "#07111b";
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.strokeStyle = "#0d415f";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#a5b6c3";
    ctx.font = "12px monospace";
    ctx.fillText("ROBOT INTEGRITY", x + 12, y + 18);

    const barX = x + 12;
    const barY = y + 27;
    const w = 216;
    const h = 12;
    const segments = 10;
    const gap = 3;

    const segmentWidth = (w - gap * (segments - 1)) / segments;

    for (let i = 0; i < segments; i++) {
        const segmentX = barX + i * (segmentWidth + gap);

        ctx.fillStyle = "#152630";
        ctx.fillRect(segmentX, barY, segmentWidth, h);

        if (i < health / 10) {
            ctx.fillStyle = "#35e6a1";
            ctx.fillRect(segmentX, barY, segmentWidth, h);
        }
    }

   
    ctx.fillStyle = "#35e6a1";
    ctx.font = "bold 14px monospace";
    ctx.fillText(`${health}%`, x + 12, y + 55);

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
    if (teleporting) {
        const frameX = (teleportFrame % 10) * 256;
        const frameY = Math.floor(teleportFrame / 10) * 256;

        ctx.save();

        if (facing === "left") {
            ctx.translate(player.x + player.size, 0);
            ctx.scale(-1, 1);

            ctx.drawImage(
                teleportSprite,
                frameX, frameY, 256, 256,
                0, player.y, player.size, player.size
            );
        } else {
            ctx.drawImage(
                teleportSprite,
                frameX, frameY, 256, 256,
                player.x, player.y, player.size, player.size
            );
        }
        
        ctx.restore();
    }

    else if (playerSprite.complete && playerSprite.naturalWidth > 0) {
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

    

    drawHealthBar();
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



function animateTeleport(deltaTime){
    if (!teleporting) return;

    teleportFrameTimer += deltaTime;
    if(teleportFrameTimer >= teleportFrameDuration){
        teleportFrameTimer -=  teleportFrameDuration;
        teleportFrame++;

        if (teleportFrame === 10){
            if (teleportTarget){
                player.y = teleportTarget.y - player.size;
                jumpRemaining =maxJumps;
                jumpVelocity = 0;
                isJumping = false
            }
        }
        if (teleportFrame >= 20){
                teleporting =false;
                teleportFrame = 0;
                teleportFrameTimer = 0;
                teleportTarget = null
            }
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
        ClickMusic.currentTime = 0;
        ClickMusic.play();
        backgroundMusic.play();
        

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
        ClickMusic.currentTime = 0;
        ClickMusic.play();
        dialogueIndex++;
        if (dialogueIndex == 3){
            botDropping = true;
            player.y = -player.size
            ClickMusic.currentTime = 0
            ClickMusic.play()
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
    const deltaFrames = deltaTime / (1000 / 60);
    gameLoop.lastTime = timestamp;

    if (gameState === "playing") {
        update(deltaFrames);
        
    }
    if(isWalking !== wasWalking){
        transitionTimer = transitionDuration;
        wasWalking = isWalking;
    }
    if (transitionTimer > 0){
        transitionTimer -= deltaTime
    }
    animateTeleport(deltaTime);

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




