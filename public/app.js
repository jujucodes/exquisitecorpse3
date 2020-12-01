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
        let username = nameInput.value;
        let existingRmInput = existingRoom.value;
        let userRmObj = {
            "username": username,
            "roomName": existingRmInput,
        };
        socket.emit('userRmMsg', userRmObj);
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



    //let msgInput = document.getElementById('msg-input');
    // let sendButton = document.getElementById('send-button');

    // sendButton.addEventListener('click', function () {
    //     let curName = nameInput.value;

    //     let curMsg = msgInput.value;
    //     let msgObj = {
    //         "name": curName,
    //         "date": Date.now(),
    //         "msg": curMsg
    //     };

    //     //Send the message object to the server
    //     socket.emit('msg', msgObj);

    //     //save msg obj to nedb
    //     db.insert(msgObj);

    //     function addMsgToPage(obj) {
    //         //Create a message string and page element
    //         let receivedMsg = obj.name + ": " + obj.msg;
    //         let msgEl = document.createElement('p');
    //         msgEl.innerHTML = receivedMsg;

    //         //Add the element with the message to the page
    //         chatBox.appendChild(msgEl);
    //         //Add a bit of auto scroll for the chat box
    //         chatBox.scrollTop = chatBox.scrollHeight;
    //     };
    // });
});