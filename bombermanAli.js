const gameBoard = document.querySelector('.game-board');
let player
let bomb

function createBoard() {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      gameBoard.appendChild(cell);
    }
  }
  
  player = document.createElement('div');
  player.classList.add('cell', 'player');
  gameBoard.appendChild(player);
  player.style.gridRow = 5;
  player.style.gridColumn = 5;
  
  
  bomb = document.createElement('div');
  bomb.classList.add('cell', 'bomb');
  gameBoard.appendChild(bomb);
  bomb.style.gridRow = 2;
  bomb.style.gridColumn = 2;
}

createBoard()

function movePlayer(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  switch (e.key) {
    case 'ArrowUp':
      console.log(playerRow - 1, playerCol)
      if (isEmpty(playerRow - 1, playerCol)) {
        player.style.gridRow = playerRow - 1;
      }
      player.direction = "up"
      break;
    case 'ArrowDown':
      if (isEmpty(playerRow + 1, playerCol)) {
        player.style.gridRow = playerRow + 1;
      }
      player.direction = "down"
      break;
    case 'ArrowLeft':
      if (isEmpty(playerRow, playerCol - 1)) {
        player.style.gridColumn = playerCol - 1;
      }
      player.direction = "left"
      break;
    case 'ArrowRight':
      if (isEmpty(playerRow, playerCol + 1)) {
        player.style.gridColumn = playerCol + 1;
      }
      player.direction = "right"
      break;
  }
}

document.addEventListener('keydown', movePlayer);
document.addEventListener('keydown', checkForWin);
document.addEventListener('keydown', checkForLose);

function checkForExplosion() {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  const explosions = document.getElementsByClassName("cell explosion")

  for (let i = 0; i < explosions.length; i++) {
    const explosionRow = parseInt(explosions[i].style.gridRow);
    const explosionCol = parseInt(explosions[i].style.gridColumn);
  
    if (playerRow === explosionRow && playerCol === explosionCol) {
      alert('BOOM!');

      gameBoard.innerHTML = ""
      createBoard()
    }
  }
}

function checkForWin(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  if (playerRow === 1 && playerCol === 10) {
    alert('You win!');
    gameBoard.innerHTML = ""
    createBoard()
  }
}

function checkForLose(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  if (playerRow === 10 && playerCol === 1) {
    alert('You lose!');
    gameBoard.innerHTML = ""
    createBoard()
  }
}

function plantBomb(e) {
  const playerRow = parseInt(player.style.gridRow);
  const playerCol = parseInt(player.style.gridColumn);

  if (e.key === ' ') {
    //create element
    //add class
    //append to gameboard
    const bomb = document.createElement('div');
    bomb.classList.add('cell', 'bomb');
    
    
    switch(player.direction) {
      case 'up':
        if (isEmpty(playerRow-1, playerCol)) {
          bomb.style.gridRow = playerRow-1;
          bomb.style.gridColumn = playerCol;
        }
        break;
      case 'down':
        if (isEmpty(playerRow+1, playerCol)) {
          bomb.style.gridRow = playerRow+1;
          bomb.style.gridColumn = playerCol;
        }
        break;
      case 'left':
        if (isEmpty(playerRow, playerCol-1)) {
          bomb.style.gridRow = playerRow;
          bomb.style.gridColumn = playerCol-1;
        }
        break;
      case 'right':
        if (isEmpty(playerRow, playerCol+1)) {
          bomb.style.gridRow = playerRow;
          bomb.style.gridColumn = playerCol+1;
        }
        break;
    }

    let bombRow = parseInt(bomb.style.gridRow);
    let bombCol = parseInt(bomb.style.gridColumn);
    setTimeout(function() {
      //delete bomb div
      bomb.remove()
      //for this cell and adjacent cells
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i !== 0 && j !== 0) continue;
          //create orange div
          const orange = document.createElement('div');
          orange.classList.add('cell', 'explosion');
          //set gridRow and gridColumn
          orange.style.gridRow = bombRow + i;
          orange.style.gridColumn = bombCol + j;
          //append to gameboard
          gameBoard.appendChild(orange);
          checkForExplosion()
          //set timeout to remove orange div
          setTimeout(function() {
            orange.remove()
          }, 1000)
        }
      }
    }, 3000, bomb);
    gameBoard.appendChild(bomb);
  }
}

document.addEventListener('keydown', plantBomb);


//function to check position of argument
function isPositionOf(element) {
  const row = parseInt(element.style.gridRow);
  const col = parseInt(element.style.gridColumn);
  return function (otherElement) {
    return row === parseInt(otherElement.style.gridRow) && col === parseInt(otherElement.style.gridColumn);
  }
}

//function to check if position is empty
function isEmpty(row, col) {
  
  if (cell === null) return true
  return !cell.classList.contains('bomb');
}
