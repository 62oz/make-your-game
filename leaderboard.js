const leaderboardContent = document.getElementById('leaderboard-content')
const gameOverForm = document.getElementById('game-over-form')
const pagination = document.getElementById('pagination')
const prevButton = document.getElementById('prev-btn')
const nextButton = document.getElementById('next-btn')

const pageSize = 10
let currentPage = 1
let scoreData = []

function renderLeaderboard (data) {
  // Clear existing leaderboard content
  leaderboardContent.innerHTML = ''

  if (data.length > 0) {
    // Calculate the start and end index of the current page
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, data.length)

    // Display the scores for the current page
    for (let i = startIndex; i < endIndex; i++) {
      let player = data[i]
      let playerRow = document.createElement('div')
      playerRow.classList.add('player-row')
      if (player.name.length < 1) {
        player.name = 'XXX'
      }
      playerRow.innerHTML = `
        <div class="player-name-score">${player.name} ${player.score}</div>
      `
      leaderboardContent.appendChild(playerRow)
    }

    // Display pagination arrows
    const totalPages = Math.ceil(data.length / pageSize)
    const prevPage = currentPage > 1 ? currentPage - 1 : 1
    const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages

    prevButton.addEventListener('click', () => setCurrentPage(prevPage))
    nextButton.addEventListener('click', () => setCurrentPage(nextPage))
  }
}

function setCurrentPage (page) {
  console.log('peepaaw')
  currentPage = page
  renderLeaderboard(scoreData)
}

export function getLeaderboardData (score = -1) {
  // Get player name from form
  const playerName = document.getElementById('game-over-name').value
  gameOverForm.addEventListener('submit', event => {
    event.preventDefault()
    gameOverForm.style.display = 'none'
    // Send player name to server
    fetch('http://localhost:8080/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: playerName, score: score })
    })
      .then(response => response.json())
      .then(data => {
        scoreData = data
        renderLeaderboard(data)
      })
      .catch(error => {
        console.log(error)
      })
  })
}
