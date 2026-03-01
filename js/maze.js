// ===== JS=====
let canvas, ctx;

let tileSize = 20;
let rows = 15;
let cols = 20;

let maze = [];
let player = { x: 1, y: 1 };
let moves = 0;
let time = 0;
let timer = null;
let timerStarted = false;
const themes = {
  neon: "",
  green: "theme-green",
  purple: "theme-purple"
};

function initMaze() {
  canvas = document.getElementById("mazeCanvas");
  if (!canvas) {
    console.error("Canvas não encontrado");
    return;
  }
  ctx = canvas.getContext("2d");
  resetGame();
  loadRanking();
}

function resetGame() {
  clearInterval(timer);
  timer = null;
  time = 0;
  moves = 0;
  timerStarted = false;

  updateUI();
  generateMaze();
  drawMaze();
}
function startTimer() {
  if (timerStarted) return;

  timerStarted = true;
  timer = setInterval(() => {
    time++;
    document.getElementById("time").innerText = time;
  }, 1000);
}
function generateMaze() {
  maze = Array.from({ length: rows }, () =>
    Array(cols).fill(1)
  );

  function carve(x, y) {
    const dirs = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx > 0 && ny > 0 &&
        nx < cols - 1 &&
        ny < rows - 1 &&
        maze[ny][nx] === 1
      ) {
        maze[y + dy / 2][x + dx / 2] = 0;
        maze[ny][nx] = 0;
        carve(nx, ny);
      }
    }
  }

  maze[1][1] = 0;
  carve(1, 1);
  maze[rows - 2][cols - 2] = 2;

  player = { x: 1, y: 1 };
}

function drawMaze() {
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;

  const wall = cssVar("--wall");
  const path = cssVar("--path");
  const goal = cssVar("--goal");

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) ctx.fillStyle = wall;
      else if (maze[y][x] === 2) ctx.fillStyle = goal;
      else ctx.fillStyle = path;

      ctx.fillRect(
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(
    player.x * tileSize,
    player.y * tileSize,
    tileSize,
    tileSize
  );
}

function movePlayer(dir) {
  let { x, y } = player;

  if (dir === "up") y--;
  if (dir === "down") y++;
  if (dir === "left") x--;
  if (dir === "right") x++;

  if (maze[y][x] !== 1) {
    player = { x, y };
    moves++;
    document.getElementById("moves").innerText = moves;

    startTimer();
  }

  if (maze[y][x] === 2) win();
  drawMaze();
}
function win() {
  clearInterval(timer);
  timerStarted = false;

  saveScore();
  document.getElementById("victoryText").innerText =
    `Tempo: ${time}s | Movimentos: ${moves}`;
  document.getElementById("victory").classList.add("show");
}
function saveScore() {
  const scores = JSON.parse(
    localStorage.getItem("mazeScores") || "[]"
  );

  scores.push({ time, moves });
  scores.sort((a, b) =>
    a.time - b.time || a.moves - b.moves
  );

  localStorage.setItem(
    "mazeScores",
    JSON.stringify(scores.slice(0, 5))
  );
}

function loadRanking() {
  const list = document.getElementById("rankingList");
  if (!list) return;

  list.innerHTML = "";
  const scores = JSON.parse(
    localStorage.getItem("mazeScores") || "[]"
  );

  scores.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.time}s - ${s.moves} mov`;
    list.appendChild(li);
  });
}

function changeDifficulty() {
  const d = document.getElementById("difficulty").value;

  if (d === "easy") { rows = 15; cols = 20; }
  if (d === "medium") { rows = 21; cols = 28; }
  if (d === "hard") { rows = 27; cols = 36; }

  resetGame();
}

function cssVar(name) {
  return getComputedStyle(document.body)
    .getPropertyValue(name)
    .trim();
}

function changeTheme() {
  document.body.classList.remove(
    "theme-green",
    "theme-purple"
  );

  const value = document.getElementById("theme").value;
  if (themes[value]) {
    document.body.classList.add(themes[value]);
  }

  drawMaze();
}

function updateUI() {
  document.getElementById("moves").innerText = 0;
  document.getElementById("time").innerText = 0;
  document.getElementById("victory").classList.remove("show");
}

document.addEventListener("keydown", e => {
  if (e.key.startsWith("Arrow")) {
    movePlayer(
      e.key.replace("Arrow", "").toLowerCase()
    );
  }
});

window.move = movePlayer;
window.restartMaze = resetGame;
window.changeTheme = changeTheme;
window.changeDifficulty = changeDifficulty;
window.initMaze = initMaze;