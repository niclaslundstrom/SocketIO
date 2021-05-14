const response = await axios.get('https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple')

const express = require('express')
const app = express()
const http = require('http')
const httpServer = http.createServer(app)
const io = require('socket.io')(httpServer)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

httpServer.listen(3000, () => {
    console.log('Server is listening on port 3000 ...');
});






/* Randomize array in-place using Durstenfeld shuffle algorithm 
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }>
}*/