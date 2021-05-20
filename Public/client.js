const socket = io('/')

const playerQ = document.getElementById('playerQ')
const play = document.getElementById('play')
const buttons = document.getElementById('buttons')
const answer1 = document.getElementById('answer1')
const answer2 = document.getElementById('answer2')
const answer3 = document.getElementById('answer3')
const answer4 = document.getElementById('answer4')
const spectatorMessage = document.getElementById('spectatorMessage');
const roomSelector = document.getElementById('roomSelector')
const log = document.getElementById('log')


socket.on('question', payload => {
  buttons.hidden = false
  playerQ.innerHTML = payload.question
  answer1.innerHTML = payload.array[0]
  answer2.innerHTML = payload.array[1]
  answer3.innerHTML = payload.array[2]
  answer4.innerHTML = payload.array[3]
})

function answer(value) {
  let answer = (value.innerHTML)
  socket.emit('checkAnswer', answer)
}

let num = 1
function increaseNumber() {
  num++
  return num
}

socket.on('spectatorQ', payload => {
  const span = document.createElement('span')
  span.style.display = 'block'
  span.id = 'question'
  span.textContent = 'Question ' + num + ': ' + payload.question
  increaseNumber()
  log.appendChild(span)
  spectatorMessage.hidden = false
})

socket.on('spectatorA', ({ answer, correct }) => {
  const span = document.createElement('span')
  span.style.display = 'block'
  span.id = 'answer'
  span.textContent = 'Player answer: ' + answer + ' (' + correct + ')'
  log.appendChild(span)
  spectatorMessage.hidden = false
})

socket.on('playerDisconnect', player => {
  if (player === null) {
    play.innerHTML = 'Player disconnected'
    window.location.reload()
  }
})


