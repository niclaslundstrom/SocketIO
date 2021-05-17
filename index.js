const axios = require("axios")



const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer)

const req = async () => {
  console.log('inne i funktion req')
    const response = await axios.get('https://opentdb.com/api.php?amount=1&category=11&difficulty=medium&type=multiple')
    //console.log(response.data.results[0])
    let data = response.data.results[0]
    question(data)
  }


function question(data)  {
    //console.log(data.question);
    let array = [];
    array.push(data.correct_answer)
    array.push(data.incorrect_answers[0]);
    array.push(data.incorrect_answers[1]);
    array.push(data.incorrect_answers[2]);
     for (let i = array.length -1; i > 0; i--) {
       let j = Math.floor(Math.random() * (i + 1));
       var temp = array[i];
       array[i] = array[j];
       array[j] = temp;
     }
    let question = data.question
    console.log(array)
    return question, array

}


app.use(express.static(path.join(__dirname,'/Public')))

io.of("/").on("connect", (socket) => {
 
    req();
    console.log(`client with id ${socket.id} connected`);
  socket.on('question', msg =>{
    io.of('/').emit('question', `${msg.array}`)
  })
    socket.send(`Hello Player ${socket.id}, lets start the game`);
    socket.on("disconnect", () => {
      console.log(`client with id ${socket.id} disconnected`);
    });
 
});


httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000 ...');
});

