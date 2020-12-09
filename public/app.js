let chatBox;


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
    let joinButton = document.getElementById('joinButton');


    joinButton.addEventListener('click', () => {
        window.location.href = '/private/index.html';
    });


});