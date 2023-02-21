import { Level1 } from './level1.js'
import { Level2 } from './level2.js'
import { Level3 } from './level3.js'

function loadLevel () {
  let level = parseInt(localStorage.getItem('level') || 1)

  document.documentElement.setAttribute('level', level)

  if (level === 1) {
    Level1()
  } else if (level === 2) {
    Level2()
  } else if (level === 3) {
    Level3()
  }
}

loadLevel()
