//backend code
//ie --> server code

let express = require('express');

//app = application
//using constructor to create an express app
let app = express();

//create our server
let server = app.listen(3000);

// have my application use files in the public folder
app.use(express.static('public'));

let socket = require('socket.io');

// create a variable that keeps track of inputs and outputs
let io = socket(server);

//setup a connection event (ie. new car on the highway lane of 3000)
// second parameter - callback
io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('new connection: ' + socket.id);
    socket.on('mouse', mouseMsg);
    socket.on('emoji', emojiMsg);
    function mouseMsg(data){
        //console.log(data);
        socket.broadcast.emit('mouse', data);
    }
    function emojiMsg(data){
        socket.broadcast.emit('emoji', data);
    }
}