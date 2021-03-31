//backend code
//ie --> server code

let express = require('express');

//app = application
//using constructor to create an express app
let app = express();

//create our server
let port = process.env.PORT || 3000;
let server = app.listen(port);


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
    socket.on('draw', drawMsg);
    socket.on('clear', clearMsg);
    function drawMsg(data){
        //console.log(data);
        socket.broadcast.emit('draw', data);
    }
    function clearMsg(data){
        //broadcast sends to every client except source client
        socket.broadcast.emit('clear');
    }
}