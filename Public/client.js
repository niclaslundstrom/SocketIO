const socket = io('/');

const q = document.getElementById('q')
const log = document.getElementById('log');
const roomSelector = document.getElementById('roomSelector');
const input = document.querySelector("input[type='text']");

console.log('hej123')
socket.emit('askForQuestion')

socket.on('question', payload => {
  console.log(payload.array)

  q.innerHTML = payload.question
})
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