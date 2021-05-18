const socket = io('/');

const q = document.getElementById('q')
const buttons = document.getElementById('buttons')
const answer1 = document.getElementById('answer1')
const answer2 = document.getElementById('answer2')
const answer3 = document.getElementById('answer3')
const answer4 = document.getElementById('answer4')
const log = document.getElementById('log');
const roomSelector = document.getElementById('roomSelector');

socket.on('question', payload => {
  buttons.hidden = false
  q.innerHTML = payload.question
  answer1.innerHTML = payload.array[0]
  answer2.innerHTML = payload.array[1]
  answer3.innerHTML = payload.array[2]
  answer4.innerHTML = payload.array[3]

})

function answer(value) {
  let answer = (value.innerHTML)
  socket.emit('checkAnswer', answer)
  socket.emit('askForQuestion')
}
/*
socket.on("message", message => {
    const span = document.createElement("span");
    span.style.display = "block";
    span.textContent = message;
    log.appendChild(span);
  });

function changeRoom() {
    socket.emit('joinRoom', roomSelector.value);
}*/