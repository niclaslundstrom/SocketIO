const axios = require('axios')
const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer)

let correctAnswer = null
function question(data) {
  // console.log(data.question);
  let array = []
  correctAnswer = data.correct_answer
  array.push(data.correct_answer)
  array.push(data.incorrect_answers[0])
  array.push(data.incorrect_answers[1])
  array.push(data.incorrect_answers[2])
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  let question = data.question
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, "'")
    .replace(/&amp;/g, '&')
  return { question, array }
}

app.use(express.static(path.join(__dirname, '/Public')))

let player = null
let activeRoom = 'playerRoom'
let data = null
const sendQuestion = async (socket) => {
  const response = await axios.get(
    'https://opentdb.com/api.php?amount=1&category=11&difficulty=medium&type=multiple'
  )
  // console.log(response.data.results[0])
  data = response.data.results[0]
  socket.emit('question', question(data))
  io.in('SpectatorRoom').emit('spectatorQ', question(data))
}

io.of('/').on('connect', (socket) => {
  if (player === null) {
    player = socket.id
    console.log(activeRoom)
    socket.join('playerRoom')
    sendQuestion(socket)

    console.log('player')
  } else {
    activeRoom = 'SpectatorRoom'
    console.log(activeRoom)
    // socket.emit('spectatorQ', question(data))
    socket.join('SpectatorRoom')
    console.log('spectator')
    socket.emit('spectatorQ', question(data))
  }
  console.log(`client with id ${socket.id} connected`)

  socket.on('checkAnswer', (answer) => {
    if (correctAnswer === answer) {
      console.log('correct')
      sendQuestion(socket)
      //io.in('SpectatorRoom').emit('spectatorQ', question(data))
      io.in('SpectatorRoom').emit('spectatorA', { answer, correct: 'Correct' })
    } else {
      console.log('ERRORRRR')
      sendQuestion(socket)
      // io.in('SpectatorRoom').emit('spectatorQ', question(data))
      io.in('SpectatorRoom').emit('spectatorA', {
        answer,
        correct: 'Incorrect'
      })
    }
  })
  /* socket.emit('question', msg => {
      io.of('/').emit('question', `${msg.array}`)
    })
    socket.send(`Hello Player ${socket.id}, lets start the game`);*/
  socket.on('disconnect', () => {
    if (socket.id === player) {
      player = null
    }
    console.log(`client with id ${socket.id} disconnected`)
  })
})

httpServer.listen(3000, () => {
  console.log('Server is listening on port 3000 ...')
})
