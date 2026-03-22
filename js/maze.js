// ===== CONFIG =====
let playerImg = new Image();
playerImg.src = "assets/imagens/naruto-z.webp";

let goalImg = new Image();
goalImg.src = "assets/imagens/naruto-kurama.webp"; 

let canvas, ctx;
let tileSize = 20;
let rows = 15;
let cols = 20;

let maze = [];
let player = { x: 1, y: 1 };

let direction = "right";
let moves = 0;
let time = 0;

let timer = null;
let timerStarted = false;

// ===== TEMAS =====
const themes = {
  neon: "",
  green: "theme-green",
  purple: "theme-purple"
};

// ===== INICIAR =====
function initMaze() {
  canvas = document.getElementById("mazeCanvas");
  if(!canvas){
    console.error("Canvas não encontrado");
    return;
  }
  ctx = canvas.getContext("2d");

  newMaze();
  resetGame(false); 
  loadRanking();
}

// ===== INICIAR JOGO =====
function startGame() {
  resetGame(false); 
  startTimer();

  document.getElementById("status").innerText =
    "Jogo iniciado! Encontre a saída 🎮";
}

// ===== RESET =====
function resetGame(clearRanking = false){
  if(clearRanking){
    localStorage.removeItem("mazeScores");
    loadRanking();
  }

  clearInterval(timer);
  timer = null;
  time = 0;
  moves = 0;
  timerStarted = false;

  player = { x: 1, y: 1 };

  updateUI();
  drawMaze();
}

// ===== REINICIAR + LIMPAR RANKING =====
function restartMazeAndClearRanking(){
  if(confirm("Deseja realmente zerar o ranking?")){
    resetGame(true); 
  } else {
    resetGame(false); 
  }
}

// ===== NOVO LABIRINTO =====
function newMaze() {
  generateMaze();
  drawMaze();
}

// ===== TIMER =====
function startTimer(){
  if(timerStarted) return;

  timerStarted = true;
  timer = setInterval(()=>{
    time++;
    document.getElementById("time").innerText = time;
  },1000);
}

// ===== GERAR LABIRINTO =====
function generateMaze(){
  maze = Array.from({length:rows},()=>Array(cols).fill(1));

  function carve(x,y){
    const dirs = [[2,0],[-2,0],[0,2],[0,-2]].sort(()=>Math.random()-0.5);
    for(const [dx,dy] of dirs){
      const nx = x + dx;
      const ny = y + dy;
      if(nx>0 && ny>0 && nx<cols-1 && ny<rows-1 && maze[ny][nx]===1){
        maze[y+dy/2][x+dx/2] = 0;
        maze[ny][nx] = 0;
        carve(nx,ny);
      }
    }
  }

  maze[1][1] = 0;
  carve(1,1);
  maze[rows-2][cols-2] = 2;
  player = {x:1,y:1};
}

// ===== DESENHAR LABIRINTO =====
function drawMaze(){
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;

  const wall = cssVar("--wall");
  const path = cssVar("--path");

  for(let y=0;y<rows;y++){
    for(let x=0;x<cols;x++){
      if(maze[y][x]===1){
        ctx.fillStyle = wall;
        ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize);
      } else {
        ctx.fillStyle = path;
        ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize);

        if(maze[y][x]===2){
          ctx.drawImage(goalImg, x*tileSize-5, y*tileSize-5, tileSize+10, tileSize+10);
        }
      }
    }
  }
  drawPlayer();
}

// ===== JOGADOR =====
function drawPlayer(){
  const px = player.x * tileSize;
  const py = player.y * tileSize;

  ctx.save();
  ctx.shadowColor = "#f70101";
  ctx.shadowBlur = 15;
  ctx.translate(px + tileSize/2, py + tileSize/2);

  let angle = 0;
  if(direction==="up") angle = -Math.PI/2;
  if(direction==="down") angle = Math.PI/2;
  if(direction==="left") angle = Math.PI;

  ctx.rotate(angle);
  ctx.drawImage(playerImg, -tileSize/2 + 2, -tileSize/2 + 2, tileSize - 4, tileSize - 4);
  ctx.restore();
}

// ===== MOVIMENTO =====
function movePlayer(dir){
  let {x,y} = player;

  if(dir==="up") y--;
  if(dir==="down") y++;
  if(dir==="left") x--;
  if(dir==="right") x++;

  direction = dir;

  if(!maze[y] || maze[y][x]===1) return;

  player = {x,y};
  moves++;
  document.getElementById("moves").innerText = moves;

  startTimer();

  if(maze[y][x]===2){
    win();
  }

  drawMaze();
}

// ===== VITÓRIA =====
function win(){
  clearInterval(timer);
  timerStarted = false;

  saveScore();

  const victory = document.getElementById("victory");
  const text = document.getElementById("victoryText");

  text.innerHTML = `
    🎉 Você venceu!<br>
    ⏱️ Tempo: <strong>${time}s</strong><br>
    🎯 Movimentos: <strong>${moves}</strong>
  `;

  setTimeout(() => {
    victory.classList.add("show");
  }, 200);
}

// ===== SCORE =====
function saveScore(){
  const scores = JSON.parse(localStorage.getItem("mazeScores") || "[]");
  scores.push({time,moves});
  scores.sort((a,b)=>a.time-b.time || a.moves-b.moves);
  localStorage.setItem("mazeScores", JSON.stringify(scores.slice(0,5)));
  loadRanking();
}

// ===== RANKING =====
function loadRanking(){
  const list = document.getElementById("rankingList");
  if(!list) return;

  list.innerHTML="";
  const scores = JSON.parse(localStorage.getItem("mazeScores") || "[]");

  scores.forEach(s=>{
    const li = document.createElement("li");
    li.textContent = `${s.time}s - ${s.moves} mov`;
    list.appendChild(li);
  });
}

// ===== DIFICULDADE =====
function changeDifficulty(){
  const d = document.getElementById("difficulty").value;

  if(d==="easy"){
    rows=15; cols=20;
  } else if(d==="medium"){
    rows=21; cols=28;
  } else if(d==="hard"){
    rows=27; cols=36;
  }

  resetGame(false);
  newMaze();
}

// ===== CSS VAR =====
function cssVar(name){
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

// ===== TEMA =====
function changeTheme(){
  document.body.classList.remove("theme-green","theme-purple");
  const value = document.getElementById("theme").value;

  if(themes[value]){
    document.body.classList.add(themes[value]);
  }

  drawMaze();
}

// ===== UI =====
function updateUI(){
  document.getElementById("moves").innerText = 0;
  document.getElementById("time").innerText = 0;

  const v = document.getElementById("victory");
  if(v) v.classList.remove("show");
}

// ===== CONTROLES =====
document.addEventListener("keydown", e=>{
  if(e.key.startsWith("Arrow")){
    movePlayer(e.key.replace("Arrow","").toLowerCase());
  }
});

// ===== EXPORT =====
window.move = movePlayer;
window.restartMaze = resetGame;
window.restartMazeAndClearRanking = restartMazeAndClearRanking;
window.changeTheme = changeTheme;
window.changeDifficulty = changeDifficulty;
window.initMaze = initMaze;
window.startGame = startGame;

// ===== START =====
window.addEventListener("DOMContentLoaded", ()=>{ initMaze(); });