const axios = require('axios')
const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer)

app.use(express.static(path.join(__dirname, '/Public')))

let correctAnswer

function question(data) {
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


let player = null
let activeRoom = 'playerRoom'
let data = null

const sendQuestion = async (socket) => {
  const response = await axios.get(
    'https://opentdb.com/api.php?amount=1&category=11&difficulty=medium&type=multiple'
  )

  data = response.data.results[0]
  socket.emit('question', question(data))
  io.in('SpectatorRoom').emit('spectatorQ', question(data))
}

//When client connecting
io.of('/').on('connect', (socket) => {
  if (player === null) {
    player = socket.id
    socket.join('playerRoom')
    sendQuestion(socket)

  } else {
    activeRoom = 'SpectatorRoom'
    socket.join('SpectatorRoom')
    socket.emit('spectatorQ', question(data))
  }

  //Check if answer is correct
  socket.on('checkAnswer', (answer) => {
    if (correctAnswer === answer) {
      console.log('correct')
      sendQuestion(socket)
      io.in('SpectatorRoom').emit('spectatorA', {
        answer, correct:
          'Correct'
      })
    } else {
      console.log('ERRORRRR')
      sendQuestion(socket)
      io.in('SpectatorRoom').emit('spectatorA', {
        answer,
        correct: 'Incorrect'
      })
    }
  })

  //Client disconnecting
  socket.on('disconnect', () => {
    if (socket.id === player) {
      player = null
      io.in('SpectatorRoom').emit('playerDisconnect', player)
    }
  })
})

httpServer.listen(3000, () => {
  console.log('Server is listening on port 3000 ...')
})
