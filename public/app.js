let chatBox;



// Get username and room from URL
//const {
//username,
//room
//} = Qs.parse(location.search, {
// ignoreQueryPrefix: true
//});

//console.log(username, room);

//Open and connect socket
let socket = io();

window.addEventListener('load', function () {

    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    /* --- Code to RECEIVE a socket message from the server --- */
    chatBox = document.getElementById('chat-box-msgs');

    //Listen for messages named 'msg' from the server
    socket.on('confirm', function (data) {
        console.log("Message arrived!");
        console.log(data);
    });

    /* --- Code to SEND a socket message to the Server --- */
    let roomName = document.getElementById('roomName');
    let nameInput = document.getElementById('username');
    let createButton = document.getElementById('createButton');
    let joinButton = document.getElementById('joinButton');

    createButton.addEventListener('click', () => {
        let username = nameInput.value;
        let roomNameInput = roomName.value;
        let userRmObj = {
            "username": username,
            "roomName": roomNameInput,
        };
        console.log(username, roomName);
        socket.emit('userRmMsg', userRmObj);
    });

    joinButton.addEventListener('click', () => {
        window.location.href = '/private/index.html';
    });

    //let space bar enter the word
    document.addEventListener('keydown', function (ev) {
        console.log(ev.which);
    });

    var e = new KeyboardEvent('keydown', {
        'keyCode': 32,
        'which': 32
    });
    console.log(e);
    document.dispatchEvent(e);

});