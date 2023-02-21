import { getLeaderboardData } from './leaderboard.js'

export function Level1 () {
  const pageAccessedByReload =
    (window.performance.navigation &&
      window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType('navigation')
      .map(nav => nav.type)
      .includes('reload')

  // AUDIOS
  const mainMusic = document.getElementById('main-music')
  const level1Music = document.getElementById('level1-music')
  const level2Music = document.getElementById('level2-music')
  const level3Music = document.getElementById('level3-music')
  const putBombSound = document.getElementById('put-bomb-sound')
  const explosionSound = document.getElementById('explosion-sound')
  const monsterDeathSound = document.getElementById('monster-death')
  const burnSound = document.getElementById('burn-sound')
  const keySound = document.getElementById('key-sound')
  const gameOverMusic = document.getElementById('game-over-music')

  // Function to mute/unmute sound
  const muteBtn = document.getElementById('mute-btn')
  muteBtn.addEventListener('click', () => {
    mainMusic.muted = !mainMusic.muted
    level1Music.muted = !level1Music.muted
    level2Music.muted = !level2Music.muted
    level3Music.muted = !level3Music.muted
    putBombSound.muted = !putBombSound.muted
    explosionSound.muted = !explosionSound.muted
    monsterDeathSound.muted = !monsterDeathSound.muted
    burnSound.muted = !burnSound.muted
    keySound.muted = !keySound.muted
    gameOverMusic.muted = !gameOverMusic.muted
    if (mainMenu.style.display === 'flex') {
      mainMusic.play()
    } else {
      level1Music.play()
    }
  })

  // Pause other music
  level2Music.pause()
  level3Music.pause()
  gameOverMusic.pause()

  const staticBoard = document.getElementById('static-board')
  //Main menu
  const mainMenu = document.getElementById('main-menu')

  mainMenu.style.display = 'flex'
  if (mainMenu.style.display === 'flex') {
    mainMusic.play()
  } else {
    mainMusic.pause()
  }
  const startButton = document.getElementById('start-btn')
  startButton.addEventListener('click', () => {
    // Start game
    mainMenu.style.display = 'none'
    mainMusic.pause()
    level1Music.play()
    mainMenu.remove()
    staticBoard.style.visibility = 'visible'
    gameLoop()
  })

  // Initialize game variables

  let score = 0
  let lives = 3
  let initialTimer = 180
  let timer = initialTimer
  let keyTouched = false
  let gamePaused = false
  let startedTimer = true
  let immune = false
  // Initialize game elements
  const gameContainer = document.getElementById('game-container')
  const scoreBoard = document.getElementById('score-board')
  const countdown = document.getElementById('countdown')
  const clock = document.getElementById('clock')
  const manekiNeko = document.getElementById('maneki-neko')

  const pauseMenu = document.getElementById('pause-menu')
  const continueBtn = document.getElementById('continue-btn')
  const continueBtnD = document.getElementById('continue-btnD')
  const continueBtnD2 = document.getElementById('continue-btnD2')

  const restartBtn = document.getElementById('restart-btn')
  const restartBtn2 = document.getElementById('restart-btn2')
  const gameOverScore = document.getElementById('game-over-score')
  const player = document.getElementById('player')
  const explosions = document.getElementsByClassName('explosion')
  const dynamicBoard = document.getElementById('dynamic-board')
  const dialogueBox = document.getElementById('dialogue-box')
  const dialogueBox2 = document.getElementById('dialogue-box2')

  const wallBlock = document.getElementsByClassName('wallBlock')
  const gameOverScreen = document.getElementById('game-over-screen')
  const leaderboard = document.getElementById('leaderboard')
  const hearts = document.getElementsByClassName('heart')
  const overlay = document.getElementById('overlay')
  const gameOverForm = document.getElementById('game-over-form')

  // Add wallBlock every other row and column
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (i % 2 === 0 && j % 2 === 0) {
        const wall = wallBlock[0].cloneNode(true)
        wall.style.top = `${i * 50}px`
        wall.style.left = `${j * 50}px`
        staticBoard.appendChild(wall)
      }
    }
  }

  //Surround game board with walls
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (i === 0 || i === 14 || j === 0 || j === 14) {
        const wall = wallBlock[0].cloneNode(true)
        wall.style.top = `${i * 50}px`
        wall.style.left = `${j * 50}px`
        wall.style.backgroundImage = "url('sprites/walls.png')"
        staticBoard.appendChild(wall)
      }
    }
  }

  // Make a goal div and add it to the bottom right corner with id of goal
  const goal = document.createElement('div')
  goal.id = 'goal'
  goal.style.top = '650px'
  goal.style.left = '650px'
  // 50x50 yellow square
  goal.style.backgroundImage = "url('sprites/Taiko_2.png')"
  goal.style.width = '50px'
  goal.style.height = '50px'
  goal.style.position = 'absolute'
  dynamicBoard.appendChild(goal)

  // Add random number between 30 and 80 of boxBlocks to dynamic board, making sure they don't overlap with walls and top and left values must be multiple of 50
  for (let i = 0; i < Math.floor(Math.random() * 50 + 100); i++) {
    const box = document.createElement('div')
    box.classList.add('boxBlock')
    box.style.top = `${Math.floor(Math.random() * 14 + 1) * 50}px`
    box.style.left = `${Math.floor(Math.random() * 14 + 1) * 50}px`
    dynamicBoard.appendChild(box)
  }

  let boxBlocks = document.getElementsByClassName('boxBlock')
  // Remove boxes placed on top of walls
  for (let i = 0; i < wallBlock.length; i++) {
    for (let j = 0; j < boxBlocks.length; j++) {
      if (
        wallBlock[i].getBoundingClientRect().x ===
          boxBlocks[j].getBoundingClientRect().x &&
        wallBlock[i].getBoundingClientRect().y ===
          boxBlocks[j].getBoundingClientRect().y
      ) {
        boxBlocks[j].remove()
      }
    }
  }

  // Remove any boxBlocks between 0 and 200px left and 0 and 200px top
  boxBlocks = document.getElementsByClassName('boxBlock')
  for (let i = boxBlocks.length - 1; i >= 0; i--) {
    if (
      parseInt(boxBlocks[i].style.left) <= 200 &&
      parseInt(boxBlocks[i].style.top) <= 200
    ) {
      boxBlocks[i].remove()
    }
  }

  // If there is block on top of goal, remove it
  for (let i = 0; i < boxBlocks.length; i++) {
    if (
      boxBlocks[i].getBoundingClientRect().x ===
        goal.getBoundingClientRect().x &&
      boxBlocks[i].getBoundingClientRect().y === goal.getBoundingClientRect().y
    ) {
      boxBlocks[i].remove()
    }
  }

  // Put key in random boxBlock
  const key = document.getElementById('key')
  const randomBox = boxBlocks[Math.floor(Math.random() * boxBlocks.length)]
  key.style.position = 'absolute'
  key.style.top = randomBox.style.top
  key.style.left = randomBox.style.left
  key.style.backgroundImage = "url('sprites/maneki-neko.png')"
  // size 50x50
  key.style.width = '50px'
  key.style.height = '50px'

  // Add monsters to dynamic board
  const spawnMonsters = N => {
    for (let i = 0; i < N; i++) {
      const monster = document.createElement('div')
      monster.classList.add('monster')
      monster.style.top = `${Math.floor(Math.random() * 14 + 1) * 50}px`
      monster.style.left = `${Math.floor(Math.random() * 14 + 1) * 50}px`
      dynamicBoard.appendChild(monster)
      // If monster is placed on top of wall, remove it and try again
      if (
        monster.getBoundingClientRect().x ===
          wallBlock[0].getBoundingClientRect().x &&
        monster.getBoundingClientRect().y ===
          wallBlock[0].getBoundingClientRect().y
      ) {
        monster.remove()
        i--
        continue
      }
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
      // If monster is placed on top of boxBlock, remove it and try again
      for (let j = 0; j < boxBlocks.length; j++) {
        if (
          monster.getBoundingClientRect().x ===
            boxBlocks[j].getBoundingClientRect().x &&
          monster.getBoundingClientRect().y ===
            boxBlocks[j].getBoundingClientRect().y
        ) {
          monster.remove()
          i--
          break
        }
      }
    }
  }

  // Define pixel locations of all .wallBlock elements
  let wallBlockPositions = []
  let wallBlocks = document.getElementsByClassName('wallBlock')
  for (let i = 0; i < wallBlocks.length; i++) {
    let wallBlock = wallBlocks[i]
    let wallBlockTop = parseInt(wallBlock.style.top)
    let wallBlockLeft = parseInt(wallBlock.style.left)
    let wallBlockHeight = parseInt(wallBlock.offsetHeight)
    let wallBlockWidth = parseInt(wallBlock.offsetWidth)
    wallBlockPositions.push({
      top: wallBlockTop,
      left: wallBlockLeft,
      bottom: wallBlockTop + wallBlockHeight,
      right: wallBlockLeft + wallBlockWidth
    })
  }
  // Define pixel locations of all .boxBlock elements
  let boxBlockPositions = []
  for (let i = 0; i < boxBlocks.length; i++) {
    let boxBlock = boxBlocks[i]
    let boxBlockTop = parseInt(boxBlock.style.top)
    let boxBlockLeft = parseInt(boxBlock.style.left)
    let boxBlockHeight = parseInt(boxBlock.offsetHeight)
    let boxBlockWidth = parseInt(boxBlock.offsetWidth)
    boxBlockPositions.push({
      top: boxBlockTop,
      left: boxBlockLeft,
      bottom: boxBlockTop + boxBlockHeight,
      right: boxBlockLeft + boxBlockWidth
    })
  }

  // Combined array of all wallBlock and boxBlock positions
  let wallAndBoxBlockPositions = wallBlockPositions.concat(boxBlockPositions)

  spawnMonsters(4)

  // Check if any monster is on top of a wall or boxBlock and if yes remove and respawn
  let monsters = document.getElementsByClassName('monster')
  for (let i = 0; i < monsters.length; i++) {
    let monster = monsters[i]
    let monsterTop = parseInt(monster.style.top)
    let monsterLeft = parseInt(monster.style.left)
    let monsterHeight = parseInt(monster.offsetHeight)
    let monsterWidth = parseInt(monster.offsetWidth)
    let monsterPosition = {
      top: monsterTop,
      left: monsterLeft,
      bottom: monsterTop + monsterHeight,
      right: monsterLeft + monsterWidth
    }
    for (let j = 0; j < wallAndBoxBlockPositions.length; j++) {
      if (
        monsterPosition.top < wallAndBoxBlockPositions[j].bottom &&
        monsterPosition.bottom > wallAndBoxBlockPositions[j].top &&
        monsterPosition.left < wallAndBoxBlockPositions[j].right &&
        monsterPosition.right > wallAndBoxBlockPositions[j].left
      ) {
        monster.remove()
        spawnMonsters(1)
        monsters = document.getElementsByClassName('monster')
        i = 0
      }
    }
  }

  // Check if there are monsters 0 and 200px left and 0 and 200px top
  for (let i = 0; i < monsters.length; i++) {
    if (
      parseInt(monsters[i].style.left) <= 200 &&
      parseInt(monsters[i].style.top) <= 200
    ) {
      monsters[i].remove()
      // Spawn new monster
      spawnMonsters(1)
    }
  }

  // Replace all initial monstermonster positions by 10px right and 5px down
  for (let i = 0; i < monsters.length; i++) {
    monsters[i].style.left = `${parseInt(monsters[i].style.left) + 10}px`
    monsters[i].style.top = `${parseInt(monsters[i].style.top) + 5}px`
  }

  // Give every monster movementpoint attribute initialized to 0
  for (let i = 0; i < monsters.length; i++) {
    monsters[i].setAttribute('movementpoint', 50)
  }

  // Give every monster direction attribute
  for (let i = 0; i < monsters.length; i++) {
    monsters[i].setAttribute('direction', 'none')
  }

  // Get box and wall blocks positions
  const boxBlocksPositions = []
  for (let i = 0; i < boxBlocks.length; i++) {
    boxBlocksPositions.push([
      parseInt(boxBlocks[i].style.left),
      parseInt(boxBlocks[i].style.top)
    ])
    boxBlocks[i].dataset.frame = 0
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

  let timeAtPause = 0

  // Handle continue button
  continueBtn.addEventListener('click', () => {
    timer = timeAtPause
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
      } else if (dialogueBox.style.display === 'block') {
        // click continue button
        continueBtn.click()
      } else {
        gamePaused = !gamePaused
        startedTimer = false
        if (gamePaused) {
          level1Music.pause()
          overlay.style.display = 'block'
          timeAtPause = timer
          pauseMenu.style.display = 'block'
        } else {
          if (timeAtPause) {
            timer = timeAtPause
            updateMetrics()
          }
          level1Music.play()
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
    location.reload()
  })
  restartBtn2.addEventListener('click', () => {
    location.reload()
  })

  // Update score, lives and timer
  const updateMetrics = () => {
    scoreBoard.innerHTML = `Score<br>${score}`
    // Hide hearts that are lost
    for (let i = 0; i < hearts.length; i++) {
      if (i >= lives) {
        hearts[i].style.visibility = 'hidden'
      }
    }
    countdown.innerHTML = `Timer: ${timer}`
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
    putBombSound.play()

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
      explosionSound.play()

      // explosion disappears after 1 second
      setTimeout(() => {
        explosion.remove()
      }, 1000)
    }, 2400)

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

    let bombTop = parseInt(bomb.style.top)
    let bombLeft = parseInt(bomb.style.left)
    let bombBottom = bombTop + parseInt(bomb.offsetHeight)
    let bombRight = bombLeft + parseInt(bomb.offsetWidth)

    // Check if bomb is placed on a wall
    for (let i = 0; i < wallBlockPositions.length; i++) {
      let wallBlock = wallBlockPositions[i]
      if (
        bombTop < wallBlock.bottom &&
        bombBottom > wallBlock.top &&
        bombLeft < wallBlock.right &&
        bombRight > wallBlock.left
      ) {
        //Put bomb on closest multiple of 50 to player's top and left
        bomb.style.top = Math.ceil(parseInt(player.style.top) / 50) * 50 + 'px'
        bomb.style.left =
          Math.ceil(parseInt(player.style.left) / 50) * 50 + 'px'
        if (
          bombTop < wallBlock.bottom &&
          bombBottom > wallBlock.top &&
          bombLeft < wallBlock.right &&
          bombRight > wallBlock.left
        ) {
          bomb.remove()
          clearTimeout(bombTimeout)
        }
        return
      }
    }
    // Check if bomb is placed on a box
    for (let i = 0; i < boxBlockPositions.length; i++) {
      let boxBlock = boxBlockPositions[i]
      if (
        bombTop < boxBlock.bottom &&
        bombBottom > boxBlock.top &&
        bombLeft < boxBlock.right &&
        bombRight > boxBlock.left
      ) {
        bomb.style.top = Math.ceil(parseInt(player.style.top) / 50) * 50 + 'px'
        bomb.style.left =
          Math.ceil(parseInt(player.style.left) / 50) * 50 + 'px'
        if (
          bombTop < boxBlock.bottom &&
          bombBottom > boxBlock.top &&
          bombLeft < boxBlock.right &&
          bombRight > boxBlock.left
        ) {
          bomb.remove()
          clearTimeout(bombTimeout)
        }
        return
      }
    }
    // Get goal top left right bottom
    const goalTop = parseInt(goal.style.top)
    const goalLeft = parseInt(goal.style.left)
    const goalBottom = goalTop + parseInt(goal.offsetHeight)
    const goalRight = goalLeft + parseInt(goal.offsetWidth)
    // Check if bomb is placed on the goal
    if (
      bombTop < goalBottom &&
      bombBottom > goalTop &&
      bombLeft < goalRight &&
      bombRight > goalLeft
    ) {
      bomb.remove()
      clearTimeout(bombTimeout)
      // DIALOGUE
      dialogueWithGoal()
      return
    }
    // Get key top left right bottom
    const keyTop = parseInt(key.style.top)
    const keyLeft = parseInt(key.style.left)
    const keyBottom = keyTop + parseInt(key.offsetHeight)
    const keyRight = keyLeft + parseInt(key.offsetWidth)
    // Check if bomb is placed on the key
    if (
      bombTop < keyBottom &&
      bombBottom > keyTop &&
      bombLeft < keyRight &&
      bombRight > keyLeft
    ) {
      bomb.remove()
      clearTimeout(bombTimeout)
      return
    }
  }

  continueBtnD.addEventListener('click', () => {
    dialogueBox.style.display = 'none'
    gamePaused = false
    startedTimer = true
    gameLoop()
  })

  continueBtnD2.addEventListener('click', () => {
    dialogueBox2.style.display = 'none'
    //reload page
    location.reload()
  })

  // Handle dialogue with goal
  function dialogueWithGoal () {
    // Pause game
    gamePaused = true
    startedTimer = false
    timeAtPause = timer
    // Fill dialogue box
    if (!keyTouched) {
      dialogueBox.style.display = 'block'
    } else {
      dialogueBox2.style.display = 'block'
      // CONTINUE TO LEVEL 2
      localStorage.setItem('level', 2)
      localStorage.setItem('score', score)
    }
  }

  // Handle putting bomb when pressing spacebar
  document.addEventListener('keydown', event => {
    if (event.key === ' ') {
      putBomb()
    }
  })

  let reduceTimer = () => {
    while (startedTimer) {
      setInterval(() => {
        timer -= 1
      }, 1000)
      startedTimer = false
    }
  }

  const goalBlockPosition = {
    top: parseInt(goal.style.top) + 5,
    left: parseInt(goal.style.left) + 10,
    bottom: parseInt(goal.style.top) + parseInt(goal.offsetHeight) + 5,
    right: parseInt(goal.style.left) + parseInt(goal.offsetWidth) + 10
  }

  const monsterLookingRight = new Image()
  monsterLookingRight.src = 'sprites/goldfish-right.png'
  const monsterLookingLeft = new Image()
  monsterLookingLeft.src = 'sprites/goldfish-left.png'

  //Give each monster animationIndex property
  for (let i = 0; i < monsters.length; i++) {
    monsters[i].animationIndex = 0
    monsters[i].style.backgroundImage = `url(${monsterLookingRight.src})`
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
        left: monsterLeft + 10,
        bottom: monsterTop + monsterHeight + 5,
        right: monsterLeft + monsterWidth + 10
      })
    }

    // Combined wall and box and bomb positions
    let combinedPositions = [
      ...wallBlockPositions,
      ...boxBlockPositions,
      ...bombPositions,
      ...monsterPositions
    ]

    // Check if monster is blocked by wall or box or bomb or another monster
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

      // Check if monster is blocked by wall or box or bomb
      for (let i = 0; i < combinedPositions.length; i++) {
        let wallAndBoxBlock = combinedPositions[i]
        //Check if monster is blocked by wall or box on top with 5px margin
        if (
          monsterTop - 5 <= wallAndBoxBlock.bottom &&
          monsterBottom > wallAndBoxBlock.top &&
          monsterLeft > wallAndBoxBlock.left &&
          monsterRight < wallAndBoxBlock.right
        ) {
          monsterBlockedTop = true
        }
        //Check if monster is blocked by wall or box on right with 10px margin
        if (
          monsterRight + 10 >= wallAndBoxBlock.left &&
          monsterLeft < wallAndBoxBlock.right &&
          monsterTop > wallAndBoxBlock.top &&
          monsterBottom < wallAndBoxBlock.bottom
        ) {
          monsterBlockedRight = true
        }
        //Check if monster is blocked by wall or box on bottom with 5px margin
        if (
          monsterBottom + 5 >= wallAndBoxBlock.top &&
          monsterTop < wallAndBoxBlock.bottom &&
          monsterLeft > wallAndBoxBlock.left &&
          monsterRight < wallAndBoxBlock.right
        ) {
          monsterBlockedBottom = true
        }
        //Check if monster is blocked by wall or box on left with 10px margin
        if (
          monsterLeft - 10 <= wallAndBoxBlock.right &&
          monsterRight > wallAndBoxBlock.left &&
          monsterTop > wallAndBoxBlock.top &&
          monsterBottom < wallAndBoxBlock.bottom
        ) {
          monsterBlockedLeft = true
        }
      }

      // Monsters can't go to goal position
      if (
        monsterTop - 5 <= goalBlockPosition.bottom &&
        monsterBottom > goalBlockPosition.top &&
        monsterLeft > goalBlockPosition.left &&
        monsterRight < goalBlockPosition.right
      ) {
        monsterBlockedTop = true
      }
      if (
        monsterRight + 10 >= goalBlockPosition.left &&
        monsterLeft < goalBlockPosition.right &&
        monsterTop > goalBlockPosition.top &&
        monsterBottom < goalBlockPosition.bottom
      ) {
        monsterBlockedRight = true
      }
      if (
        monsterBottom + 5 >= goalBlockPosition.top &&
        monsterTop < goalBlockPosition.bottom &&
        monsterLeft > goalBlockPosition.left &&
        monsterRight < goalBlockPosition.right
      ) {
        monsterBlockedBottom = true
      }
      if (
        monsterLeft - 10 <= goalBlockPosition.right &&
        monsterRight > goalBlockPosition.left &&
        monsterTop > goalBlockPosition.top &&
        monsterBottom < goalBlockPosition.bottom
      ) {
        monsterBlockedLeft = true
      }

      if (slowedBy >= monsterSlowFrameRate) {
        if (monsterDirection === 'left') {
          monster.style.backgroundImage = `url(${monsterLookingLeft.src})`
        } else if (monsterDirection === 'right') {
          monster.style.backgroundImage = `url(${monsterLookingRight.src})`
        }
        drawSprite(monster, monster.animationIndex, 0, 30, 0)
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
            }
            break
          case monsterDirection === 'right':
            // Move if not blocked
            if (!monsterBlockedRight) {
              monster.style.left = monsterLeft + 1 + 'px'
              monster.movementPoints += 1
            }
            break
          case monsterDirection === 'up':
            // Move if not blocked
            if (!monsterBlockedTop) {
              monster.style.top = monsterTop - 1 + 'px'
              monster.movementPoints += 1
            }
            break
          case monsterDirection === 'down':
            // Move if not blocked
            if (!monsterBlockedBottom) {
              monster.style.top = monsterTop + 1 + 'px'
              monster.movementPoints += 1
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

  let clockIndex = 0
  let clockSlowFrameRate = 10

  let lastClockChange = 0
  const MIN_CLOCK_CHANGE_DELAY = 1000 // 100 milliseconds

  function changeClock () {
    // Check if enough time has passed since the last clock change
    const now = Date.now()
    if (now - lastClockChange < MIN_CLOCK_CHANGE_DELAY) {
      return
    }

    // Update the clock background position
    if (
      (timer % Math.floor(initialTimer / 5) === 0 && timer !== initialTimer) ||
      timer === 1
    ) {
      clockIndex += 1
      if (clockIndex > 5) {
        clockIndex = 5
      }
      clock.style.backgroundPosition = `0px -${clockIndex * 50}px`
    }

    // Update the last clock change time
    lastClockChange = now
  }

  //animate goal
  let goalIndex = 0
  let goalSlowFrameRate = 10

  let lastGoalChange = 0
  let MIN_GOAL_CHANGE_DELAY = 300

  function changeGoal () {
    // Check if enough time has passed since the last clock change
    const now = Date.now()
    if (now - lastGoalChange < MIN_GOAL_CHANGE_DELAY) {
      return
    }
    goalIndex += 1
    if (goalIndex > 2) {
      goalIndex = 0
    }
    goal.style.backgroundPosition = `0px -${goalIndex * 50}px`

    // Update the last clock change time
    lastGoalChange = now
    if (timer < initialTimer / 2) {
      MIN_GOAL_CHANGE_DELAY = 200
    }
    if (timer < initialTimer / 4) {
      MIN_GOAL_CHANGE_DELAY = 100
    }
  }

  ////////////

  function touchKey () {
    let playerTop = parseInt(player.style.top)
    let playerLeft = parseInt(player.style.left)
    let playerRight = playerLeft + parseInt(player.offsetWidth)
    let playerBottom = playerTop + parseInt(player.offsetHeight)
    let keyTop = parseInt(key.style.top)
    let keyLeft = parseInt(key.style.left)
    let keyRight = keyLeft + parseInt(key.offsetWidth)
    let keyBottom = keyTop + parseInt(key.offsetHeight)

    if (
      playerLeft < keyRight &&
      playerRight > keyLeft &&
      playerTop < keyBottom &&
      playerBottom > keyTop
    ) {
      // Player is touched by key
      key.style.display = 'none'
      manekiNeko.style.visibility = 'visible'
      keyTouched = true
      keySound.play()
    }
  }

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

      // Check if any box is within first or second rectangle (with playerTop playerLeft playerRight playerBottom)
      for (let j = 0; j < boxBlockPositions.length; j++) {
        let boxBlock = boxBlockPositions[j]
        if (
          (boxBlock.left < maxX1 &&
            boxBlock.right > minX1 &&
            boxBlock.top < maxY1 &&
            boxBlock.bottom > minY1) ||
          (boxBlock.left < maxX2 &&
            boxBlock.right > minX2 &&
            boxBlock.top < maxY2 &&
            boxBlock.bottom > minY2)
        ) {
          // If box is within explosion area, remove box that has these coordinates
          for (let k = 0; k < boxBlocks.length; k++) {
            let boxToRemove = boxBlocks[k]
            if (
              boxToRemove.style.left === `${boxBlock.left}px` &&
              boxToRemove.style.top === `${boxBlock.top}px`
            ) {
              burnSound.play()
              let burnBox = setInterval(() => {
                let boxYIndex = parseInt(boxToRemove.dataset.frame)
                if (slowedBy >= boxSlowFrameRate) {
                  drawSprite(boxToRemove, 0, boxYIndex, 0, -50)
                  slowedBy = 0
                  boxYIndex += 1
                  boxToRemove.dataset.frame = boxYIndex
                  if (boxYIndex > 6) {
                    clearInterval(burnBox)
                    boxToRemove.remove()
                  }
                } else {
                  slowedBy += 1
                }
              }, 100)
              score += 10
            }
          }
        }
      }

      // Update boxBlockPositions
      boxBlockPositions = []
      for (let i = 0; i < boxBlocks.length; i++) {
        let boxBlock = boxBlocks[i]
        let boxBlockTop = parseInt(boxBlock.style.top)
        let boxBlockLeft = parseInt(boxBlock.style.left)
        let boxBlockRight = boxBlockLeft + parseInt(boxBlock.offsetWidth)
        let boxBlockBottom = boxBlockTop + parseInt(boxBlock.offsetHeight)
        boxBlockPositions.push({
          top: boxBlockTop,
          left: boxBlockLeft,
          right: boxBlockRight,
          bottom: boxBlockBottom
        })
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
              monsterDeathSound.play()
              monsterToRemove.remove()
              score += 200
            }
          }
        }
      }
    }

    // Update metrics
    updateMetrics()
    // Check for end game conditions
    if (timer <= 0 || lives <= 0) {
      // End game
      // Show game over screen with score and restard button
      gameOverScore.innerText = `${score}`
      gameOverScreen.style.display = 'flex' // get json data for leaderboard content
      gameOverMusic.play()

      getLeaderboardData(score)

      leaderboard.style.display = 'block'
      gameOverForm.style.display = 'block'
      gameContainer.style.display = 'none'
    } else {
      requestAnimationFrame(gameLoop)
    }
  }

  //start with player and bomb in random positions within the board
  let playerX = 60
  let playerY = 60

  player.style.left = playerX + 'px'
  player.style.top = playerY + 'px'

  // Game loop using requestAnimationFrame
  const gameLoop = () => {
    if (!gamePaused) {
      //call reduceTimerdrawSpriteRollDown
      reduceTimer()
      moveMonsters()
      touchExplosion()
      touchMonster()
      touchKey()
      changeClock()
      changeGoal()

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
        // Find next intersection with wallBlock
        let intersects = false
        for (let i = 0; i < wallBlockPositions.length; i++) {
          let wallBlock = wallBlockPositions[i]
          if (
            playerLeft - 3 < wallBlock.right &&
            playerRight > wallBlock.left &&
            playerTop < wallBlock.bottom &&
            playerBottom > wallBlock.top
          ) {
            intersects = true
            break
          }
        }
        // Find next intersection with boxBlock
        for (let i = 0; i < boxBlockPositions.length; i++) {
          let boxBlock = boxBlockPositions[i]
          if (
            playerLeft - 3 < boxBlock.right &&
            playerRight > boxBlock.left &&
            playerTop < boxBlock.bottom &&
            playerBottom > boxBlock.top
          ) {
            intersects = true
            break
          }
        }

        // If new player position is not wallBlockPosition, update player position
        if (!intersects) {
          player.style.left = parseInt(player.style.left) - 3 + 'px'
        }
      }
      if (moveRight) {
        // Find next intersection with wallBlock
        let intersects = false
        for (let i = 0; i < wallBlockPositions.length; i++) {
          let wallBlock = wallBlockPositions[i]
          if (
            playerLeft < wallBlock.right &&
            playerRight + 3 > wallBlock.left &&
            playerTop < wallBlock.bottom &&
            playerBottom > wallBlock.top
          ) {
            intersects = true
            break
          }
        }
        // Find next intersection with boxBlock
        for (let i = 0; i < boxBlockPositions.length; i++) {
          let boxBlock = boxBlockPositions[i]
          if (
            playerLeft < boxBlock.right &&
            playerRight + 3 > boxBlock.left &&
            playerTop < boxBlock.bottom &&
            playerBottom > boxBlock.top
          ) {
            intersects = true
            break
          }
        }

        // If new player position is not wallBlockPosition, update player position
        if (!intersects) {
          player.style.left = parseInt(player.style.left) + 3 + 'px'
        }
      }
      if (moveUp) {
        // Find next intersection with wallBlock
        let intersects = false
        for (let i = 0; i < wallBlockPositions.length; i++) {
          let wallBlock = wallBlockPositions[i]
          if (
            playerLeft < wallBlock.right &&
            playerRight > wallBlock.left &&
            playerTop - 4 < wallBlock.bottom &&
            playerBottom > wallBlock.top
          ) {
            intersects = true
            break
          }
        }
        // Find next intersection with boxBlock
        for (let i = 0; i < boxBlockPositions.length; i++) {
          let boxBlock = boxBlockPositions[i]
          if (
            playerLeft < boxBlock.right &&
            playerRight > boxBlock.left &&
            playerTop - 4 < boxBlock.bottom &&
            playerBottom > boxBlock.top
          ) {
            intersects = true
            break
          }
        }

        // If new player position is not wallBlockPosition, update player position
        if (!intersects) {
          player.style.top = parseInt(player.style.top) - 3 + 'px'
        }
      }

      if (moveDown) {
        // Find next intersection with wallBlock
        let intersects = false
        for (let i = 0; i < wallBlockPositions.length; i++) {
          let wallBlock = wallBlockPositions[i]
          if (
            playerLeft < wallBlock.right &&
            playerRight > wallBlock.left &&
            playerTop < wallBlock.bottom &&
            playerBottom + 4 > wallBlock.top
          ) {
            intersects = true
            break
          }
        }
        // Find next intersection with boxBlock
        for (let i = 0; i < boxBlockPositions.length; i++) {
          let boxBlock = boxBlockPositions[i]
          if (
            playerLeft < boxBlock.right &&
            playerRight > boxBlock.left &&
            playerTop < boxBlock.bottom &&
            playerBottom + 4 > boxBlock.top
          ) {
            intersects = true
            break
          }
        }

        // If new player position is not wallBlockPosition, update player position
        if (!intersects) {
          player.style.top = parseInt(player.style.top) + 3 + 'px'
        }
      }
    }
  }

  if (pageAccessedByReload) {
    //click start button
    startButton.click()
  }
}
