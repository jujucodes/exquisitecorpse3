//initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//initialize nedb
let Datastore = require('nedb');
let db = new Datastore('stories.db');
db.loadDatabase();


//initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//initialize socket.io
let io = require('socket.io')();
io.listen(server);

//initialize private room namespace
//Allows us to better manage the rooms
let private = io.of('/private');

let numUsers = 0;

//Listen for users connecting to main page
io.sockets.on('connection', function (socket) {
    console.log("We have a new client: " + socket.id);

    let addedUser = false;

    //Listen for a message named 'msg' from this client
    socket.on('msg', function (data) {
        //Data can be numbers, strings, objects
        console.log("Received a new part of the corpse");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', {
            username: socket.username,
            message: data
        });
    });

    socket.on('userRmMsg', (data) => {
        console.log(data);
        db.insert(data);
        let confirmed = {
            'msg': "message saved"
        };
        socket.emit('confirm', confirmed);
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    //Listen for this client to disconnect
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
        if (addedUser) {
            --numUsers;
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        };
    });
});

//Listen for users connecting to private page
private.on('connection', function (socket) {
    console.log("We have a new private client: " + socket.id);

    socket.on('room', function (data) {
        let roomName = data.room;
        //let roomName = document.getElementById('roomName');

        console.log("Create/Join Room: " + roomName);
        //Add this socket to the room
        socket.join(roomName);
        //Add a room property to the individual socket
        socket.room = roomName;
        //Let everyone in the room know that a new user has joined
        let joinMsg = "A new user has joined the exquisite corpse: " + roomName;
        private.to(roomName).emit("joined", {
            msg: joinMsg
        });

        //initalize timestamp
        let timestamp = Date.now();
        roomName.timestamp = timestamp;

    });
    //do i need this code?? especially if first page is just log in
    //Listen for a message named 'msg' from this client
    socket.on('msg', function (data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        let roomName = socket.room;
        //Send a response to all clients, including this one
        private.to(roomName).emit('msg', data);
    });

    //Listen for this client to disconnect
    socket.on('disconnect', function () {
        console.log("A client has disconnected: " + socket.id);
    });
});