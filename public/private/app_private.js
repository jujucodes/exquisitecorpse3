let chatBox;
let roomName;
let nameInput = document.getElementById('username-input');
let msgInput = document.getElementById('msg-input');
let sendButton = document.getElementById('send-button');
let myStory = "";


//countdown timer
const startingMinutes = 3;
let time = startingMinutes * 60;
let countdownEl = document.getElementById('countdown');

let timeInterval = setInterval(updateCountdown, 1000);


function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    countdownEl.innerHTML = `${minutes}:${seconds}`;

    time--;

    if (time < 0) {
        clearInterval(timeInterval);

        chatBox.innerHTML = "";

        let storyEl = document.createElement('p');

        storyEl.innerHTML = myStory;

        //Add the element with the message to the page
        chatBox.appendChild(storyEl);

        chatBox.style.overflow = "scroll";
    };
    //when timer = 0, stop time--

    //when timer = 0, post myStory on html block
};


window.addEventListener('load', function () {

    //Open and connect socket to private namespace
    let socket = io('/private');
    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    //Get room name
    //let roomName = document.getElementById('roomName');
    //let roomName = window.prompt("create a new haiku");
    //console.log(roomName);

    //Check if a name was entered
    //if (roomName) {
    //let roomNameOnPage = document.getElementById('roomName');
    //roomNameOnPage.innerHTML = roomName;
    //Emit Msg to join the room
    socket.emit('room', {
        "room": "main-room"
    });
    // } else {
    // alert("Please refresh and enter a room name");
    // }

    /* --- Code to RECEIVE a socket message from the server --- */
    chatBox = document.getElementById('chat-box-msgs');

    //Listen for the 'joined' msg from the server
    socket.on('joined', function (data) {
        //console.log("A new user has joined the chat!");
        console.log(data);
        //Set a boolean to manage if this is a welcome msg
        data.newUser = true;
        addMsgToPage(data);
    });

    //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);
        myStory = myStory + data.msg;
        console.log(myStory);
        addMsgToPage(data);
        //db.insert(data);
    });


    msgInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 32) {
            let curName = nameInput.value;
            let curMsg = msgInput.value;
            let msgObj = {
                "name": curName,
                "msg": curMsg
            };

            //after space pressed clear input
            msgInput.value = "";
            //Send the message object to the server
            socket.emit('msg', msgObj);
        };



    });

});

function sendMsg(obj) {
    let curName = nameInput.value;
    let curMsg = msgInput.value;
    let msgObj = {
        "name": curName,
        "msg": curMsg
    };

    //Send the message object to the server
    socket.emit('msg', msgObj);
};

function addMsgToPage(obj) {
    //Create a message string and page element
    let receivedMsg;
    if (obj.newUser) {
        receivedMsg = obj.msg;

    } else {
        receivedMsg = obj.name + ": " + obj.msg;
    }
    let msgEl = document.createElement('p');
    msgEl.innerHTML = receivedMsg;

    //Add the element with the message to the page
    chatBox.appendChild(msgEl);
    //Add a bit of auto scroll for the chat box
    chatBox.scrollTop = chatBox.scrollHeight;



};