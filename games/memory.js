const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const winMsg = document.getElementById('winMsg');
const winMoves = document.getElementById('winMoves');
const restartBtn = document.getElementById('restartBtn');

const icons = ['★','●','▲','■','◆','♥','☀','☾'];

let cards, flipped, matchedCount, moves, timer, seconds, locked;

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function reset(){
  cards = shuffle([...icons, ...icons]);
  flipped = [];
  matchedCount = 0;
  moves = 0;
  seconds = 0;
  locked = false;
  movesEl.textContent = moves;
  timeEl.textContent = '0:00';
  winMsg.classList.remove('show');
  clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    const m = Math.floor(seconds/60), s = seconds%60;
    timeEl.textContent = m + ':' + String(s).padStart(2,'0');
  }, 1000);
  render();
}

function render(){
  boardEl.innerHTML = '';
  cards.forEach((icon, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => flip(i));
    boardEl.appendChild(card);
  });
}

function flip(i){
  if(locked) return;
  const card = boardEl.children[i];
  if(card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.textContent = cards[i];
  card.classList.add('flipped');
  flipped.push(i);

  if(flipped.length === 2){
    moves++;
    movesEl.textContent = moves;
    locked = true;
    const [a,b] = flipped;

    if(cards[a] === cards[b]){
      boardEl.children[a].classList.add('matched');
      boardEl.children[b].classList.add('matched');
      matchedCount++;
      flipped = [];
      locked = false;
      if(matchedCount === icons.length){
        clearInterval(timer);
        winMoves.textContent = moves;
        winMsg.classList.add('show');
      }
    } else {
      setTimeout(() => {
        boardEl.children[a].classList.remove('flipped');
        boardEl.children[b].classList.remove('flipped');
        boardEl.children[a].textContent = '';
        boardEl.children[b].textContent = '';
        flipped = [];
        locked = false;
      }, 700);
    }
  }
}

restartBtn.addEventListener('click', reset);

reset();
