const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");

let score = 0;
let lives = 3;

const player = {
    x:220,
    y:580,
    w:40,
    h:30,
    speed:6
};

let bullets = [];

let enemies = [];

for(let row=0; row<4; row++){
    for(let col=0; col<8; col++){
        enemies.push({
            x:40 + col*50,
            y:50 + row*50,
            w:30,
            h:30,
            alive:true
        });
    }
}

let enemyDir = 1;

const keys = {};

document.addEventListener("keydown",e=>{
    keys[e.key]=true;

    if(e.key===" "){
        shoot();
    }
});

document.addEventListener("keyup",e=>{
    keys[e.key]=false;
});

document.getElementById("left").onclick=()=>{
    player.x-=30;
};

document.getElementById("right").onclick=()=>{
    player.x+=30;
};

document.getElementById("fire").onclick=shoot;

function shoot(){
    bullets.push({
        x:player.x + player.w/2 - 2,
        y:player.y,
        w:4,
        h:10
    });
}

function update(){

    if(keys["ArrowLeft"]){
        player.x-=player.speed;
    }

    if(keys["ArrowRight"]){
        player.x+=player.speed;
    }

    player.x=Math.max(0,Math.min(canvas.width-player.w,player.x));

    bullets.forEach(b=>{
        b.y-=8;
    });

    bullets=bullets.filter(b=>b.y>-20);

    let moveDown=false;

    enemies.forEach(e=>{

        if(!e.alive) return;

        e.x+=enemyDir;

        if(e.x<0 || e.x+e.w>canvas.width){
            moveDown=true;
        }
    });

    if(moveDown){

        enemyDir*=-1;

        enemies.forEach(e=>{
            e.y+=20;
        });
    }

    bullets.forEach(b=>{

        enemies.forEach(e=>{

            if(!e.alive) return;

            if(
                b.x<e.x+e.w &&
                b.x+b.w>e.x &&
                b.y<e.y+e.h &&
                b.y+b.h>e.y
            ){
                e.alive=false;
                b.y=-999;

                score+=100;
                scoreEl.textContent="SCORE: "+score;
            }
        });
    });

    enemies.forEach(e=>{

        if(!e.alive) return;

        if(e.y+e.h>player.y){

            lives=0;
            livesEl.textContent="LIFE: 0";
        }
    });

    if(lives<=0){

        alert("GAME OVER\nSCORE: "+score);
        location.reload();
    }

    const alive=enemies.filter(e=>e.alive);

    if(alive.length===0){

        alert("CLEAR!\nSCORE: "+score);
        location.reload();
    }
}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<60;i++){

        ctx.fillStyle="white";
        ctx.fillRect(
            (i*79)%canvas.width,
            (i*137)%canvas.height,
            2,
            2
        );
    }

    ctx.fillStyle="cyan";
    ctx.fillRect(
        player.x,
        player.y,
        player.w,
        player.h
    );

    ctx.fillStyle="yellow";

    bullets.forEach(b=>{
        ctx.fillRect(
            b.x,
            b.y,
            b.w,
            b.h
        );
    });

    enemies.forEach(e=>{

        if(!e.alive) return;

        ctx.fillStyle="lime";

        ctx.fillRect(
            e.x,
            e.y,
            e.w,
            e.h
        );
    });
}

function loop(){

    update();
    draw();

    requestAnimationFrame(loop);
}

loop();
