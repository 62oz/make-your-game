import { getLeaderboardData } from './leaderboard.js'

export function Level3 () {
  // LEVEL 3

  const pageAccessedByReload =
    (window.performance.navigation &&
      window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType('navigation')
      .map(nav => nav.type)
      .includes('reload')

  document.documentElement.removeAttribute('dark')

  //Clear local storage when window/tab is closed
  window.onbeforeunload = function () {
    localStorage.removeItem('level')
    localStorage.removeItem('score')
    return ''
  }

  const staticBoard = document.getElementById('static-board')
  const livesBoard = document.getElementById('lives')
  livesBoard.style.display = 'none'
  //Main menu
  const mainMenu = document.getElementById('main-menu')
  mainMenu.style.width = '750px'
  mainMenu.style.height = '750px'
  mainMenu.style.backgroundImage = "url('sprites/daruma-to-moon.png')"
  mainMenu.style.display = 'flex'

  const startButton = document.getElementById('start-btn')

  document.addEventListener('DOMContentLoaded', () => {
    startButton.style.width = '750px'
    startButton.style.height = '750px'
    startButton.style.top = '50%'
    startButton.style.left = '50%'
    startButton.style.transform = 'translate(-50%, -50%)'
    startButton.addEventListener('click', () => {
      // Start game
      if (
        mainMenu.style.backgroundImage == `url("sprites/bloodmoonlight.png")`
      ) {
        mainMenu.style.width = '750px'
        mainMenu.style.height = '750px'
        mainMenu.style.backgroundImage = "url('sprites/prologue3.png')"
        startButton.style.width = '280px'
        startButton.style.height = '130px'
        startButton.style.top = '82%'
        startButton.style.left = '50%'
      } else if (
        mainMenu.style.backgroundImage === `url("sprites/prologue3.png")`
      ) {
        mainMenu.style.display = 'none'
        mainMenu.remove()
        staticBoard.style.visibility = 'visible'
        livesBoard.style.display = 'block'
        gameLoop()
      }
    })
  })

  let bloodMoonIndex = 0

  let animateBloodMoon = setInterval(() => {
    if (mainMenu.style.backgroundImage == `url("sprites/daruma-to-moon.png")`) {
      bloodMoonIndex += 1
      if (bloodMoonIndex > 7) {
        mainMenu.style.backgroundImage = "url('sprites/bloodmoonlight.png')"
        mainMenu.style.backgroundPosition = `0px 0px`
      } else {
        mainMenu.style.backgroundPosition = `-${bloodMoonIndex * 750}px 0px`
      }
    } else {
      clearInterval(animateBloodMoon)
    }
  }, 200)

  // Initialize game variables

  let score = parseInt(localStorage.getItem('score') || 0)
  let lives = 3

  let gamePaused = false
  let immune = false
  // Initialize game elements
  const gameContainer = document.getElementById('game-container')
  const scoreBoard = document.getElementById('score-board')
  const countdownClock = document.getElementById('countdown-clock')
  const countdown = document.getElementById('countdown')
  const clock = document.getElementById('clock')
  const pauseMenu = document.getElementById('pause-menu')
  const continueBtn = document.getElementById('continue-btn')
  const continueBtnD = document.getElementById('continue-btnD')
  const restartBtn = document.getElementById('restart-btn')
  const restartBtn2 = document.getElementById('restart-btn2')
  const gameOverScore = document.getElementById('game-over-score')
  const player = document.getElementById('player')
  const explosions = document.getElementsByClassName('explosion')
  const dynamicBoard = document.getElementById('dynamic-board')

  const wallBlock = document.getElementsByClassName('wallBlock')
  const gameOverScreen = document.getElementById('game-over-screen')
  const leaderboard = document.getElementById('leaderboard')
  const hearts = document.getElementsByClassName('heart')
  const overlay = document.getElementById('overlay')
  const leaderboardContent = document.getElementById('leaderboard-content')

  // Remove all wall blocks
  for (let i = 0; i < wallBlock.length; i++) {
    wallBlock[i].remove()
  }

  // Hide clock and countdown
  clock.style.visibility = 'hidden'
  countdown.style.visibility = 'hidden'
  countdownClock.style.display = 'none'

  // Change static board background image
  staticBoard.style.backgroundImage = "url('sprites/eclipse-last.png')"
  staticBoard.style.backgroundRepeat = 'no-repeat'
  staticBoard.style.backgroundSize = '750px 750px'

  // Get center of static board
  const staticBoardCenter = {
    x: 375,
    y: 375
  }
  // Get static board radius
  const staticBoardRadius = 365

  // Function to calculate distance from center
  const distanceFromCenter = (x, y) => {
    return Math.sqrt(
      Math.pow(x - staticBoardCenter.x, 2) +
        Math.pow(y - staticBoardCenter.y, 2)
    )
  }

  // Add monsters to dynamic board
  const spawnMonsters = N => {
    for (let i = 0; i < N; i++) {
      const monster = document.createElement('div')
      monster.classList.add('monster')
      monster.style.width = '40px'
      monster.style.height = '42px'
      monster.style.top = `${Math.floor(Math.random() * 14 + 1) * 50}px`
      monster.style.left = `${Math.floor(Math.random() * 14 + 1) * 50}px`
      dynamicBoard.appendChild(monster)

      // If monster is placed on top of another monster, remove it and try again
      let monsterDuplicate = false
      for (let j = 0; j < i; j++) {
        if (
          monster.getBoundingClientRect().x ===
            document
              .getElementsByClassName('monster')
              [j].getBoundingClientRect().x &&
          monster.getBoundingClientRect().y ===
            document
              .getElementsByClassName('monster')
              [j].getBoundingClientRect().y
        ) {
          monster.remove()
          i--
          monsterDuplicate = true
          break
        }
      }
      if (monsterDuplicate) {
        continue
      }
    }
  }

  spawnMonsters(10)

  // Check if there are monsters 0 and 200px left and 0 and 200px top
  let monsters = document.getElementsByClassName('monster')
  for (let i = 0; i < monsters.length; i++) {
    if (parseInt(monsters[i].style.top) <= 250) {
      monsters[i].remove()
      // Spawn new monster
      spawnMonsters(1)
      i = 0
      monsters = document.getElementsByClassName('monster')
    }
  }

  monsters = document.getElementsByClassName('monster')

  // Give every monster movementpoint attribute initialized to 0
  for (let i = 0; i < monsters.length; i++) {
    monsters[i].setAttribute('movementPoints', 50)
  }

  // Give every monster direction attribute
  for (let i = 0; i < monsters.length; i++) {
    monsters[i].setAttribute('direction', 'none')
  }

  // Initialize player movement variables
  let moveLeft = false
  let moveRight = false
  let moveUp = false
  let moveDown = false
  let moving = false
  //Initialize player direction variables
  let lookingLeft = false
  let lookingRight = false
  let lookingUp = false
  let lookingDown = true

  // Handle player movement
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      moving = true
      moveLeft = true
      lookingLeft = true
      lookingRight = false
      lookingUp = false
      lookingDown = false
    }

    if (event.key === 'ArrowRight') {
      moving = true
      moveRight = true
      lookingRight = true
      lookingLeft = false
      lookingUp = false
      lookingDown = false
    }

    if (event.key === 'ArrowUp') {
      moving = true
      moveUp = true
      lookingUp = true
      lookingDown = false
      lookingLeft = false
      lookingRight = false
    }

    if (event.key === 'ArrowDown') {
      moving = true
      moveDown = true
      lookingDown = true
      lookingUp = false
      lookingLeft = false
      lookingRight = false
    }
  })

  document.addEventListener('keyup', event => {
    if (event.key === 'ArrowLeft') {
      moveLeft = false
      moving = false
    }
    if (event.key === 'ArrowRight') {
      moveRight = false
      moving = false
    }
    if (event.key === 'ArrowUp') {
      moveUp = false
      moving = false
    }
    if (event.key === 'ArrowDown') {
      moveDown = false
      moving = false
    }
  })

  // Handle continue button
  continueBtn.addEventListener('click', () => {
    updateMetrics()
    gamePaused = false
    overlay.style.display = 'none'
    pauseMenu.style.display = 'none'
    gameLoop()
  })

  // Handle pause/continue game
  document.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      if (mainMenu.style.display === 'flex') {
        // click start button
        startButton.click()
      } else {
        gamePaused = !gamePaused
        if (gamePaused) {
          overlay.style.display = 'block'
          pauseMenu.style.display = 'block'
        } else {
          updateMetrics()
          gamePaused = false
          overlay.style.display = 'none'
          pauseMenu.style.display = 'none'
          gameLoop()
        }
      }
    }
  })

  // Handle restart game
  restartBtn.addEventListener('click', () => {
    // set level to 1 in local storage and score to 0
    localStorage.setItem('level', 1)
    localStorage.setItem('score', 0)
    location.reload()
  })
  restartBtn2.addEventListener('click', () => {
    localStorage.setItem('level', 1)
    localStorage.setItem('score', 0)
    console.log('restart')
    location.reload()
  })

  // Update score, lives
  const updateMetrics = () => {
    scoreBoard.innerHTML = `Score<br>${score}`
    // Hide hearts that are lost
    for (let i = 0; i < hearts.length; i++) {
      if (i >= lives) {
        hearts[i].style.visibility = 'hidden'
      }
    }
  }

  const animateExplosion = (explosion, explosionYIndex) => {
    if (explosionYIndex > 0) {
      setTimeout(() => {
        drawSprite(explosion, 0, explosionYIndex, 0, 150)
        explosionYIndex -= 1
        animateExplosion(explosion, explosionYIndex)
      }, 100)
    } else {
      explosion.remove()
    }
  }

  const startExplosion = explosion => {
    let explosionYIndex = 8
    animateExplosion(explosion, explosionYIndex)
  }

  let bombSlowFrameRate = 4

  // Handle putting bomb in front of player and adding it to bombs array
  const putBomb = () => {
    // Create a new bomb element
    const bomb = document.createElement('div')
    bomb.classList.add('bomb')

    switch (true) {
      case lookingLeft:
        bomb.style.left =
          Math.floor(parseInt(player.style.left) / 50) * 50 - 45 + 'px'
        bomb.style.top =
          Math.floor(parseInt(player.style.top) / 50) * 50 + 5 + 'px'
        break
      case lookingRight:
        bomb.style.left =
          Math.ceil((parseInt(player.style.left) - 30) / 50) * 50 + 55 + 'px'
        bomb.style.top =
          Math.floor(parseInt(player.style.top) / 50) * 50 + 5 + 'px'
        break
      case lookingUp:
        bomb.style.left =
          Math.floor(parseInt(player.style.left) / 50) * 50 + 5 + 'px'
        bomb.style.top =
          Math.floor(parseInt(player.style.top) / 50) * 50 - 45 + 'px'
        break
      case lookingDown:
        bomb.style.left =
          Math.floor(parseInt(player.style.left) / 50) * 50 + 5 + 'px'
        bomb.style.top =
          Math.ceil((parseInt(player.style.top) - 20) / 50) * 50 + 55 + 'px'
        break
    }

    bomb.dataset.frame = 0

    //Add timer to bomb after which add explosion and delete bomb
    let bombTimeout = setTimeout(() => {
      // Create a new explosion element
      const explosion = document.createElement('div')
      explosion.classList.add('explosion')
      explosion.style.left = bomb.style.left
      explosion.style.top = bomb.style.top

      explosion.dataset.frame = 0
      explosion.dataset.slow = 0

      // Add explosion to game board
      document.getElementById('dynamic-board').appendChild(explosion)
      startExplosion(explosion)

      // explosion disappears after 1 second
      setTimeout(() => {
        explosion.remove()
      }, 1000)
    }, 3000)

    setTimeout(() => {
      // Animate bomb
      let animateBomb = setInterval(() => {
        if (slowedBy >= bombSlowFrameRate) {
          let bombFrame = parseInt(bomb.dataset.frame)
          drawSprite(bomb, 0, bombFrame, 0, -50)
          slowedBy = 0
          bombFrame += 1
          bomb.dataset.frame = bombFrame
          if (bombFrame > 5) {
            // Delete bomb
            bomb.remove()
            clearInterval(animateBomb)
          }
        } else {
          slowedBy += 1
        }
      }, 100)
    }, 2400)

    // Get bombs positions
    const bombBlockPositions = []
    let bombs = document.getElementsByClassName('bomb')
    for (let i = 0; i < bombs.length; i++) {
      bombBlockPositions.push([
        parseInt(bombs[i].style.left),
        parseInt(bombs[i].style.top)
      ])
    }

    // Check if bomb is placed on a bomb
    for (let i = 0; i < bombBlockPositions.length; i++) {
      let bombBlock = bombBlockPositions[i]
      if (
        parseInt(bomb.style.left) === bombBlock[0] &&
        parseInt(bomb.style.top) === bombBlock[1]
      ) {
        //Put bomb on closest multiple of 50 to player's top and left
        bomb.style.top = Math.ceil(parseInt(player.style.top) / 50) * 50 + 'px'
        bomb.style.left =
          Math.ceil(parseInt(player.style.left) / 50) * 50 + 'px'

        /* bomb.remove();
        //MAYBE
        clearTimeout(bombTimeout); */
        return
      }
    }

    //Add bomb to game board
    document.getElementById('dynamic-board').appendChild(bomb)

    bombTop = parseInt(bomb.style.top)
    bombLeft = parseInt(bomb.style.left)
    bombBottom = bombTop + parseInt(bomb.offsetHeight)
    bombRight = bombLeft + parseInt(bomb.offsetWidth)
  }

  // Handle putting bomb when pressing spacebar
  document.addEventListener('keydown', event => {
    if (event.key === ' ') {
      putBomb()
    }
  })

  //Give each monster animationIndex property
  for (let i = 0; i < monsters.length; i++) {
    monsters[i].animationIndex = 0
    monsters[i].style.backgroundImage = `url("sprites/aubergine.png")`
  }

  let monsterSlowFrameRate = 20

  // Handle monster movement
  const moveMonsters = () => {
    // Define pixel locations of all .bomb elements + margin
    let bombPositions = []
    let bombs = document.getElementsByClassName('bomb')
    for (let i = 0; i < bombs.length; i++) {
      let bomb = bombs[i]
      let bombTop = parseInt(bomb.style.top)
      let bombLeft = parseInt(bomb.style.left)
      let bombHeight = parseInt(bomb.offsetHeight)
      let bombWidth = parseInt(bomb.offsetWidth)
      bombPositions.push({
        top: bombTop + 10,
        left: bombLeft + 10,
        bottom: bombTop + bombHeight + 10,
        right: bombLeft + bombWidth + 10
      })
    }

    // Define pixel locations of all .monster elements + margin
    let monsterPositions = []
    for (let i = 0; i < monsters.length; i++) {
      let monster = monsters[i]
      let monsterTop = parseInt(monster.style.top)
      let monsterLeft = parseInt(monster.style.left)
      let monsterHeight = parseInt(monster.offsetHeight)
      let monsterWidth = parseInt(monster.offsetWidth)
      monsterPositions.push({
        top: monsterTop + 5,
        left: monsterLeft + 6,
        bottom: monsterTop + monsterHeight + 5,
        right: monsterLeft + monsterWidth + 6
      })
    }

    // Get map edge positions (staticBoard)
    let mapTop = 0
    let mapLeft = 0
    let mapBottom = parseInt(staticBoard.offsetHeight)
    let mapRight = parseInt(staticBoard.offsetWidth) - 80

    monsters = document.getElementsByClassName('monster')
    for (let i = 0; i < monsters.length; i++) {
      let monster = monsters[i]
      let monsterTop = parseInt(monster.style.top)
      let monsterLeft = parseInt(monster.style.left)
      let monsterRight = monsterLeft + parseInt(monster.offsetWidth)
      let monsterBottom = monsterTop + parseInt(monster.offsetHeight)

      let monsterDirection = monster.direction
      let monsterMovementPoints = monster.movementPoints

      let monsterBlockedTop = false
      let monsterBlockedRight = false
      let monsterBlockedBottom = false
      let monsterBlockedLeft = false

      //Check if monster is blocked edge on top with 5px margin
      if (monsterTop - 5 <= mapTop) {
        monsterBlockedTop = true
      }
      //Check if monster is blocked by edge of map
      if (monsterRight + 6 >= mapRight) {
        monsterBlockedRight = true
      }
      //Check if monster is blocked by edge of map
      if (monsterBottom + 5 >= mapBottom) {
        monsterBlockedBottom = true
      }
      //Check if monster is blocked by edge of map
      if (monsterLeft - 6 <= mapLeft) {
        monsterBlockedLeft = true
      }

      if (slowedBy >= monsterSlowFrameRate) {
        drawSprite(monster, 0, monster.animationIndex, 0, 42)
        slowedBy = 0
        monster.animationIndex += 1
        if (monster.animationIndex > 1) {
          monster.animationIndex = 0
        }
      } else {
        slowedBy += 1
      }

      // if movement points < 50, move monster in monster direction and add one to movement points
      if (monsterMovementPoints < 50) {
        switch (true) {
          case monsterDirection === 'left':
            // Move if not blocked
            if (!monsterBlockedLeft) {
              monster.style.left = monsterLeft - 1 + 'px'
              monster.movementPoints += 1
            } else {
              monster.movementPoints = 50
            }
            break
          case monsterDirection === 'right':
            // Move if not blocked
            if (!monsterBlockedRight) {
              monster.style.left = monsterLeft + 1 + 'px'
              monster.movementPoints += 1
            } else {
              monster.movementPoints = 50
            }
            break
          case monsterDirection === 'up':
            // Move if not blocked
            if (!monsterBlockedTop) {
              monster.style.top = monsterTop - 1 + 'px'
              monster.movementPoints += 1
            } else {
              monster.movementPoints = 50
            }
            break
          case monsterDirection === 'down':
            // Move if not blocked
            if (!monsterBlockedBottom) {
              monster.style.top = monsterTop + 1 + 'px'
              monster.movementPoints += 1
            } else {
              monster.movementPoints = 50
            }
            break
        }
      } else {
        // Assign to monster direction that is not blocked
        let monsterDirectionArray = ['left', 'right', 'up', 'down']
        let monsterDirectionArrayBlocked = [
          monsterBlockedLeft,
          monsterBlockedRight,
          monsterBlockedTop,
          monsterBlockedBottom
        ]
        let monsterDirectionArrayNotBlocked = []
        for (let i = 0; i < monsterDirectionArray.length; i++) {
          if (monsterDirectionArrayBlocked[i] === false) {
            monsterDirectionArrayNotBlocked.push(monsterDirectionArray[i])
          }
        }
        let monsterDirectionArrayNotBlockedRandom =
          monsterDirectionArrayNotBlocked[
            Math.floor(Math.random() * monsterDirectionArrayNotBlocked.length)
          ]
        monster.direction = monsterDirectionArrayNotBlockedRandom
        if (monster.direction !== 'none' && monster.direction !== undefined) {
          monster.movementPoints = 0
        }
      }
    }
  }

  ////ANIMATION STUFF

  const playerRollUpImg = new Image()
  playerRollUpImg.src = 'sprites/daruma-doll-roll-down.png'
  const playerRollDownImg = new Image()
  playerRollDownImg.src = 'sprites/daruma-doll-roll-up.png'
  const playerRollRightImg = new Image()
  playerRollRightImg.src = 'sprites/daruma-doll-roll-left.png'
  const playerRollLeftImg = new Image()
  playerRollLeftImg.src = 'sprites/daruma-doll.png'
  const playerUp = new Image()
  playerUp.src = 'sprites/daruma-up.png'
  const playerDown = new Image()
  playerDown.src = 'sprites/daruma-down.png'
  const playerLookingRight = new Image()
  playerLookingRight.src = 'sprites/daruma-right.png'
  const playerLookingLeft = new Image()
  playerLookingLeft.src = 'sprites/daruma-left.png'
  const playerTransparent = new Image()
  playerTransparent.src = 'sprites/transparent.png'

  let playerYIndex = 0
  let slowedBy = 0
  let playerSlowFrameRate = 10
  let explosionSlowFrameRate = 18

  player.style.backgroundImage = `url(${playerDown.src})`

  const drawSprite = (div, frameX, frameY, width, height) => {
    const y = frameY * height
    const x = frameX * width
    div.style.backgroundPosition = `${x}px ${y}px`
  }

  ////////////

  async function touchMonster () {
    let playerTop = parseInt(player.style.top)
    let playerLeft = parseInt(player.style.left)
    let playerRight = playerLeft + parseInt(player.offsetWidth)
    let playerBottom = playerTop + parseInt(player.offsetHeight)

    for (let i = 0; i < monsters.length; i++) {
      let monsterX = parseInt(monsters[i].style.left)
      let monsterY = parseInt(monsters[i].style.top)
      // Get monster area 30*40
      let minX = monsterX
      let maxX = monsterX + 30
      let minY = monsterY
      let maxY = monsterY + 40

      if (
        playerLeft < maxX &&
        playerRight > minX &&
        playerTop < maxY &&
        playerBottom > minY
      ) {
        // Player is touched by monster
        if (!immune) {
          lives -= 1
          immune = true
          //Make player blink
          let blinking = setInterval(() => {
            player.style.visibility =
              player.style.visibility === 'visible' ? 'hidden' : 'visible'
          }, 100)

          setTimeout(() => {
            //Stop player from blinking
            clearInterval(blinking)
            player.style.visibility = 'visible'
            immune = false
          }, 2000)
        }
      }
    }
  }

  let boxSlowFrameRate = 13

  async function touchExplosion () {
    let playerTop = parseInt(player.style.top)
    let playerLeft = parseInt(player.style.left)
    let playerRight = playerLeft + parseInt(player.offsetWidth)
    let playerBottom = playerTop + parseInt(player.offsetHeight)

    for (let i = 0; i < explosions.length; i++) {
      let explosionX = parseInt(explosions[i].style.left)
      let explosionY = parseInt(explosions[i].style.top)

      //Calculate top, left, right and bottom of first rectangle making the explosion area
      let minX1 = explosionX - 40
      let maxX1 = explosionX + 80
      let minY1 = explosionY
      let maxY1 = explosionY + 40
      //Calculate top, left, right and bottom of second rectangle making the explosion area
      let minX2 = explosionX
      let maxX2 = explosionX + 40
      let minY2 = explosionY - 40
      let maxY2 = explosionY + 80

      // Check if player is withing first or second rectangle (with playerTop playerLeft playerRight playerBottom)
      if (
        (playerLeft < maxX1 &&
          playerRight > minX1 &&
          playerTop < maxY1 &&
          playerBottom > minY1) ||
        (playerLeft < maxX2 &&
          playerRight > minX2 &&
          playerTop < maxY2 &&
          playerBottom > minY2)
      ) {
        // If player is within explosion area, reduce lives and update lives
        if (!immune) {
          lives -= 1
          immune = true
          //Make player blink
          let blinking = setInterval(() => {
            player.style.visibility =
              player.style.visibility === 'visible' ? 'hidden' : 'visible'
          }, 100)

          setTimeout(() => {
            //Stop player from blinking
            clearInterval(blinking)
            player.style.visibility = 'visible'
            immune = false
          }, 2000)
        }
      }

      // Check if any monster is within first or second rectangle
      let monsterPositions = []
      for (let j = 0; j < monsters.length; j++) {
        let monster = monsters[j]
        let monsterTop = parseInt(monster.style.top)
        let monsterLeft = parseInt(monster.style.left)
        let monsterRight = monsterLeft + parseInt(monster.offsetWidth)
        let monsterBottom = monsterTop + parseInt(monster.offsetHeight)
        monsterPositions.push({
          top: monsterTop,
          left: monsterLeft,
          right: monsterRight,
          bottom: monsterBottom
        })
      }
      for (let j = 0; j < monsterPositions.length; j++) {
        let monsterBlock = monsterPositions[j]
        if (
          (monsterBlock.left < maxX1 &&
            monsterBlock.right > minX1 &&
            monsterBlock.top < maxY1 &&
            monsterBlock.bottom > minY1) ||
          (monsterBlock.left < maxX2 &&
            monsterBlock.right > minX2 &&
            monsterBlock.top < maxY2 &&
            monsterBlock.bottom > minY2)
        ) {
          // If monster is within explosion area, remove monster that has these coordinates
          for (let k = 0; k < monsters.length; k++) {
            let monsterToRemove = monsters[k]
            if (
              monsterToRemove.style.left === `${monsterBlock.left}px` &&
              monsterToRemove.style.top === `${monsterBlock.top}px`
            ) {
              monsterToRemove.remove()
              score += 200
            }
          }
        }
      }
    }

    // Reset game and map function
    const resetGame = () => {
      // Reset game variables
      score = 0
      lives = 3
      // Reset game screen
      gameContainer.style.display = 'flex'
      gameOverScreen.style.display = 'none'
      leaderboard.style.display = 'none'
      // Reset player position
      playerX = 60
      playerY = 60
      player.style.left = playerX + 'px'
      player.style.top = playerY + 'px'

      // Reset boxes
      for (let i = 0; i < boxBlocks.length; i++) {
        boxBlocks[i].remove()
      }
      boxBlocks = []
      // Reset keys
      for (let i = 0; i < keys.length; i++) {
        keys[i].remove()
      }
      keys = []
      // Reset monsters
      for (let i = 0; i < monsters.length; i++) {
        monsters[i].remove()
      }
      monsters = []

      //Respawn monsters

      // Reset game loop
      requestAnimationFrame(gameLoop)
    }

    // Update metrics
    updateMetrics()
    // Check for end game conditions
    if (lives <= 0) {
      // End game
      // Show game over screen with score and restard button
      gameOverScore.innerText = `${score}`
      gameOverScreen.style.display = 'flex' // get json data for leaderboard content
      getLeaderboardData(score)

      leaderboard.style.display = 'block'
      gameContainer.style.display = 'none'
    } else {
      requestAnimationFrame(gameLoop)
    }
  }

  //start with player and bomb in random positions within the board
  let playerX = 365
  let playerY = 100

  player.style.left = playerX + 'px'
  player.style.top = playerY + 'px'

  // Check if player is outside the circle 365*365 from center of the board
  const checkPlayerPosition = () => {
    let playerX = parseInt(player.style.left)
    let playerY = parseInt(player.style.top)
    let playerCenterX = playerX + 15
    let playerCenterY = playerY + 20
    if (distanceFromCenter(playerCenterX, playerCenterY) > 365) {
      // respawn
      playerX = 365
      playerY = 100
      player.style.left = playerX + 'px'
      player.style.top = playerY + 'px'
      // remove one life
      lives -= 1
      updateMetrics()
      immune = true
      //Make player blink
      let blinking = setInterval(() => {
        player.style.visibility =
          player.style.visibility === 'visible' ? 'hidden' : 'visible'
      }, 100)
      setTimeout(() => {
        //Stop player from blinking
        clearInterval(blinking)
        player.style.visibility = 'visible'
        immune = false
      }, 2000)
    }
  }

  // Check if no more monsters left
  const checkMonsters = () => {
    monsters = document.querySelectorAll('.monster')
    if (monsters.length === 0) {
      // End game
      // Show game over screen with score and restard button
      gameOverScore.innerText = `${score}`
      // Change game over screen background image to win
      gameOverScreen.style.backgroundImage = `url("sprites/you-win.png")`

      gameOverScreen.style.display = 'flex'
      // get json data for leaderboard content
      getLeaderboardData(score)
    }
  }

  // Game loop using requestAnimationFrame
  const gameLoop = () => {
    if (!gamePaused) {
      moveMonsters()
      touchExplosion()
      touchMonster()
      checkPlayerPosition()
      checkMonsters()

      // Animation stuff
      if (moving) {
        if (moveDown) {
          player.style.backgroundImage = `url(${playerRollDownImg.src})`
        } else if (moveUp) {
          player.style.backgroundImage = `url(${playerRollUpImg.src})`
        } else if (moveLeft) {
          player.style.backgroundImage = `url(${playerRollLeftImg.src})`
        } else if (moveRight) {
          player.style.backgroundImage = `url(${playerRollRightImg.src})`
        }
        if (slowedBy >= playerSlowFrameRate) {
          drawSprite(player, 0, playerYIndex, 0, 40)
          slowedBy = 0
          playerYIndex += 1
          if (playerYIndex > 7) {
            playerYIndex = 0
          }
        } else {
          slowedBy += 1
        }
      } else {
        if (lookingDown) {
          player.style.backgroundImage = `url(${playerDown.src})`
        } else if (lookingUp) {
          player.style.backgroundImage = `url(${playerUp.src})`
        } else if (lookingLeft) {
          player.style.backgroundImage = `url(${playerLookingLeft.src})`
        } else if (lookingRight) {
          player.style.backgroundImage = `url(${playerLookingRight.src})`
        }
      }

      // Update player position
      let playerTop = parseInt(player.style.top)
      let playerLeft = parseInt(player.style.left)
      let playerRight = playerLeft + parseInt(player.offsetWidth)
      let playerBottom = playerTop + parseInt(player.offsetHeight)

      // Get positions of bombs
      let bombPositions = []
      let bombs = document.getElementsByClassName('bomb')
      for (let i = 0; i < bombs.length; i++) {
        let bomb = bombs[i]
        let bombTop = parseInt(bomb.style.top)
        let bombLeft = parseInt(bomb.style.left)
        let bombHeight = parseInt(bomb.offsetHeight)
        let bombWidth = parseInt(bomb.offsetWidth)
        bombPositions.push({
          top: bombTop + 5,
          left: bombLeft + 10,
          bottom: bombTop + bombHeight + 5,
          right: bombLeft + bombWidth + 10
        })
      }

      if (moveLeft) {
        player.style.left = parseInt(player.style.left) - 3 + 'px'
      }
      if (moveRight) {
        player.style.left = parseInt(player.style.left) + 3 + 'px'
      }
      if (moveUp) {
        player.style.top = parseInt(player.style.top) - 3 + 'px'
      }

      if (moveDown) {
        player.style.top = parseInt(player.style.top) + 3 + 'px'
      }
    }
  }

  if (pageAccessedByReload) {
    //click start button
    startButton.click()
  }
}
