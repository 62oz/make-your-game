const gameBoard = document.querySelector('.game-board');

for (let row = 0; row < 10; row++) {
  for (let col = 0; col < 10; col++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameBoard.appendChild(cell);
  }
}

const player = document.createElement('div');
player.classList.add('cell', 'player');
gameBoard.appendChild(player);
player.style.gridRow = 5;
player.style.gridColumn = 5;

const bomb = document.createElement('div');
bomb.classList.add('cell', 'bomb');
gameBoard.appendChild(bomb);
bomb.style.gridRow = 2;
bomb.style.gridColumn = 2;

function movePlayer(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  switch (e.key) {
    case 'ArrowUp':
      player.style.gridRow = playerRow - 1;
      break;
    case 'ArrowDown':
      player.style.gridRow = playerRow + 1;
      break;
    case 'ArrowLeft':
      player.style.gridColumn = playerCol - 1;
      break;
    case 'ArrowRight':
      player.style.gridColumn = playerCol + 1;
      break;
  }
}

document.addEventListener('keydown', movePlayer);
document.addEventListener('keydown', checkForBomb);
document.addEventListener('keydown', checkForWin);
document.addEventListener('keydown', checkForLose);

function checkForBomb(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);
  const bombRow = parseInt(bomb.style.gridRow);
  const bombCol = parseInt(bomb.style.gridColumn);

  if (playerRow === bombRow && playerCol === bombCol) {
    alert('BOOM!');
    player.style.gridRow = 5;
    player.style.gridColumn = 5;
  }
}

function checkForWin(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  if (playerRow === 1 && playerCol === 10) {
    alert('You win!');
  }
}

function checkForLose(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  if (playerRow === 10 && playerCol === 1) {
    alert('You lose!');
  }
}

function plantBomb(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  if (e.key === ' ') {
    bomb.style.gridRow = playerRow;
    bomb.style.gridColumn = playerCol;
    //create element
    //add class
    //append to gameboard
    const bomb = document.createElement('div');
    bomb.classList.add('cell', 'bomb');
    gameBoard.appendChild(bomb);
    


  }
}

document.addEventListener(' ', plantBomb);


                