const socket = io('/');

const q = document.getElementById('q')
const log = document.getElementById('log');
const roomSelector = document.getElementById('roomSelector');
const input = document.querySelector("input[type='text']");

console.log('hej')


socket.on('question', msg => {
    console.log('hej2')
    q.innerHTML  = msg;
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