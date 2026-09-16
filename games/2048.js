const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const overlay = document.getElementById('overlayMsg');
const overlayText = document.getElementById('overlayText');
const restartBtn = document.getElementById('restartBtn');

const tileColors = {
  2:'#f2ebe1', 4:'#eadfc9', 8:'#e8a33d', 16:'#e2913a',
  32:'#dc7f37', 64:'#d66d34', 128:'#7b5ea7', 256:'#6a4f92',
  512:'#59417d', 1024:'#3fa34d', 2048:'#2e7d3a'
};

let grid, score, best;

function loadBest(){ return Number(localStorage.getItem('arcade-2048-best') || 0); }
function saveBest(v){ localStorage.setItem('arcade-2048-best', v); }

function emptyGrid(){
  return Array.from({ length:4 }, () => Array(4).fill(0));
}

function reset(){
  grid = emptyGrid();
  score = 0;
  best = loadBest();
  scoreEl.textContent = score;
  bestEl.textContent = best;
  overlay.classList.remove('show');
  addTile();
  addTile();
  render();
}

function addTile(){
  const empties = [];
  for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(grid[r][c]===0) empties.push([r,c]);
  if(empties.length===0) return;
  const [r,c] = empties[Math.floor(Math.random()*empties.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function render(){
  boardEl.innerHTML = '';
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      const v = grid[r][c];
      const tile = document.createElement('div');
      tile.className = 'tile';
      if(v){
        tile.textContent = v;
        tile.style.background = tileColors[v] || '#17181c';
        tile.style.color = v <= 4 ? '#17181c' : '#f7f7f5';
      }
      boardEl.appendChild(tile);
    }
  }
}

function slideAndMergeLine(line){
  const vals = line.filter(v => v !== 0);
  const merged = [];
  for(let i=0;i<vals.length;i++){
    if(vals[i] === vals[i+1]){
      const m = vals[i]*2;
      merged.push(m);
      score += m;
      i++;
    } else {
      merged.push(vals[i]);
    }
  }
  while(merged.length < 4) merged.push(0);
  return merged;
}

function moveLeft(){
  let moved = false;
  for(let r=0;r<4;r++){
    const newRow = slideAndMergeLine(grid[r]);
    if(newRow.some((v,i) => v !== grid[r][i])) moved = true;
    grid[r] = newRow;
  }
  return moved;
}

function moveRight(){
  let moved = false;
  for(let r=0;r<4;r++){
    const reversed = grid[r].slice().reverse();
    const newRow = slideAndMergeLine(reversed).reverse();
    if(newRow.some((v,i) => v !== grid[r][i])) moved = true;
    grid[r] = newRow;
  }
  return moved;
}

function moveUp(){
  let moved = false;
  for(let c=0;c<4;c++){
    const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
    const newCol = slideAndMergeLine(col);
    for(let r=0;r<4;r++){
      if(grid[r][c] !== newCol[r]) moved = true;
      grid[r][c] = newCol[r];
    }
  }
  return moved;
}

function moveDown(){
  let moved = false;
  for(let c=0;c<4;c++){
    const col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
    const merged = slideAndMergeLine(col);
    const restored = merged.slice().reverse();
    for(let r=0;r<4;r++){
      if(grid[r][c] !== restored[r]) moved = true;
      grid[r][c] = restored[r];
    }
  }
  return moved;
}

function canMove(){
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      if(grid[r][c]===0) return true;
      if(c<3 && grid[r][c]===grid[r][c+1]) return true;
      if(r<3 && grid[r][c]===grid[r+1][c]) return true;
    }
  }
  return false;
}

function checkGameOver(){
  if(!canMove()){
    overlayText.textContent = 'Game over — score ' + score;
    overlay.classList.add('show');
  }
}

function move(dir){
  const fn = { left:moveLeft, right:moveRight, up:moveUp, down:moveDown }[dir];
  const moved = fn();
  if(moved){
    addTile();
    scoreEl.textContent = score;
    if(score > best){
      best = score;
      bestEl.textContent = best;
      saveBest(best);
    }
    render();
    checkGameOver();
  }
}

window.addEventListener('keydown', (e) => {
  const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
  if(map[e.key]){
    e.preventDefault();
    move(map[e.key]);
  }
});

restartBtn.addEventListener('click', reset);

reset();
