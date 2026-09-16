const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const lines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board, current, over;

function reset(){
  board = Array(9).fill(null);
  current = 'X';
  over = false;
  statusEl.textContent = "Player X's turn";
  render();
}

function render(){
  boardEl.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = val || '';
    cell.addEventListener('click', () => play(i));
    boardEl.appendChild(cell);
  });
}

function play(i){
  if(over || board[i]) return;
  board[i] = current;

  const win = checkWin();
  if(win){
    over = true;
    statusEl.textContent = 'Player ' + current + ' wins';
    render();
    win.forEach(idx => boardEl.children[idx].classList.add('win'));
    return;
  }

  if(board.every(c => c)){
    over = true;
    statusEl.textContent = "It's a draw";
    render();
    return;
  }

  current = current === 'X' ? 'O' : 'X';
  statusEl.textContent = "Player " + current + "'s turn";
  render();
}

function checkWin(){
  for(const line of lines){
    const [a,b,c] = line;
    if(board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

restartBtn.addEventListener('click', reset);

reset();
