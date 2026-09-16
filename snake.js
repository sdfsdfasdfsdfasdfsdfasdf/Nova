const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const cell = 20;
const cols = canvas.width / cell;
const rows = canvas.height / cell;

const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const overlay = document.getElementById('overlayMsg');
const overlayText = document.getElementById('overlayText');
const restartBtn = document.getElementById('restartBtn');

let snake, dir, nextDir, food, score, best, loopId, paused, alive;

function loadBest(){
  return Number(localStorage.getItem('arcade-snake-best') || 0);
}
function saveBest(v){
  localStorage.setItem('arcade-snake-best', v);
}

function reset(){
  snake = [{x:8,y:10},{x:7,y:10},{x:6,y:10}];
  dir = {x:1,y:0};
  nextDir = dir;
  score = 0;
  paused = false;
  alive = true;
  best = loadBest();
  placeFood();
  scoreEl.textContent = score;
  bestEl.textContent = best;
  overlay.classList.remove('show');
  if(loopId) clearInterval(loopId);
  loopId = setInterval(tick, 110);
  draw();
}

function placeFood(){
  let pos;
  do{
    pos = { x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows) };
  } while(snake.some(s => s.x===pos.x && s.y===pos.y));
  food = pos;
}

function tick(){
  if(paused || !alive) return;
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  const hitWall = head.x<0 || head.x>=cols || head.y<0 || head.y>=rows;
  const hitSelf = snake.some(s => s.x===head.x && s.y===head.y);

  if(hitWall || hitSelf){
    gameOver();
    return;
  }

  snake.unshift(head);

  if(head.x===food.x && head.y===food.y){
    score++;
    scoreEl.textContent = score;
    if(score > best){
      best = score;
      bestEl.textContent = best;
      saveBest(best);
    }
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = '#e8a33d';
  ctx.fillRect(food.x*cell+2, food.y*cell+2, cell-4, cell-4);

  snake.forEach((s,i) => {
    ctx.fillStyle = i===0 ? '#3fa34d' : '#17181c';
    ctx.fillRect(s.x*cell+1, s.y*cell+1, cell-2, cell-2);
  });
}

function gameOver(){
  alive = false;
  clearInterval(loopId);
  overlayText.textContent = 'Game over — score ' + score;
  overlay.classList.add('show');
}

function setDir(x,y){
  if(dir.x === -x && dir.y === -y) return;
  nextDir = { x, y };
}

window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault();
  if(k==='arrowup' || k==='w') setDir(0,-1);
  else if(k==='arrowdown' || k==='s') setDir(0,1);
  else if(k==='arrowleft' || k==='a') setDir(-1,0);
  else if(k==='arrowright' || k==='d') setDir(1,0);
  else if(k===' ') paused = !paused;
});

restartBtn.addEventListener('click', reset);

reset();
