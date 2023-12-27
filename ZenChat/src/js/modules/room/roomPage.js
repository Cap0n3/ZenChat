import { scrollDown } from "./chat_utils";

export function roomPage() {
    console.log("Sanity check from roomPage().");

    const roomName = JSON.parse(document.getElementById('roomName').textContent);
    const scrollerInner = document.querySelector("#scroller-inner") // NEW
    const chatFeed = document.querySelector("#chatFeed");
    const chatMessageInput = document.querySelector("#chatMessageInput");
    const chatMessageSend = document.querySelector("#chatMessageSend");
    const onlineUsersSelector = document.querySelector("#onlineUsersSelector");

    // adds a new option to 'onlineUsersSelector'
    function onlineUsersSelectorAdd(value) {
        if (document.querySelector("option[value='" + value + "']")) return;
        let newOption = document.createElement("option");
        newOption.value = value;
        newOption.innerHTML = value;
        onlineUsersSelector.appendChild(newOption);
    }

    // removes an option from 'onlineUsersSelector'
    function onlineUsersSelectorRemove(value) {
        let oldOption = document.querySelector("option[value='" + value + "']");
        if (oldOption !== null) oldOption.remove();
    }

    // focus 'chatMessageInput' when user opens the page
    chatMessageInput.focus();

    // submit if the user presses the enter key
    chatMessageInput.onkeyup = function(e) {
        if (e.keyCode === 13) {  // enter key
            chatMessageSend.click();
        }
    };

    chatMessageSend.onclick = function() {
        if (chatMessageInput.value.length === 0) return;
        // Forward the message to the WebSocket
        chatSocket.send(JSON.stringify({
            "message": chatMessageInput.value,
        }));
        // Clear the 'chatMessageInput'
        chatMessageInput.value = "";
    };

    //=== Websocket communication ===//

    let chatSocket = null;

    function connect(){
        chatSocket = new WebSocket("ws://" + window.location.host + "/ws/chat/" + roomName + "/");
        
        chatSocket.onopen = function(e) {
            console.log("Successfully connected to the Websocket.")
        }

        chatSocket.onclose = function(e) {
            console.log("Websocket connection closed unexpectedly. Trying to reconnect in 2s...");
            setTimeout(function() {
                console.log("Reconnecting...");
                connect();
            }, 2000);
        }

        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log(data);

            switch(data.type) {
                case "chat_message":
                    scrollerInner.insertAdjacentHTML(
                        "beforeend",    
                        `
                        <li id="msg_${data.nonce}">
                            <div class="message-container">
                                <img class="user-avatar" src="${data.avatar}" alt="avatar">
                                <h3 class="chat-user">${data.user} <span class="timestamp">${data.timestamp}</span></h3>
                                <div class="message-content">${data.message}</div>
                            </div>
                        </li>
                        `    
                    );
                    scrollDown(chatFeed);
                    break;
                case "user_list":
                    for (let i = 0; i < data.users.length; i++) {
                        onlineUsersSelectorAdd(data.users[i]);
                    }
                    break;
                case "user_join":
                    scrollerInner.insertAdjacentHTML(
                        "beforeend", 
                        //"<li><span class='chat-joined-user'><i>" + data.user + "</span> joined the room.</i></li>"
                        `
                        <li>
                            <div class="message-container">
                                <div class="chat-joined-user">--- ${data.user} joined the room ---</div>
                            </div>
                        </li>
                        `
                    );
                    onlineUsersSelectorAdd(data.user);
                    scrollDown(chatFeed);
                    break;
                case "user_leave":
                    // chatLog.value += data.user + " left the room.\n";
                    scrollerInner.insertAdjacentHTML(
                        "beforeend", 
                        //"<li><span class='chat-joined-user'><i>" + data.user + "</span> joined the room.</i></li>"
                        `
                        <li>
                            <div class="message-container">
                                <div class="chat-joined-user">--- ${data.user} left the room ---</div>
                            </div>
                        </li>
                        `
                    );
                    onlineUsersSelectorRemove(data.user);
                    scrollDown(chatFeed);
                    break;
                case "private_message":
                    // chatLog.value += "PM from " + data.user + ": " + data.message + "\n";
                    break;
                case "private_message_delivered":
                    // chatLog.value += "PM to " + data.target + ": " + data.message + "\n";
                    break;
                default:
                    //console.error("Unknown message type !");
                    console.error("Unknown message type ! \n(data.type = " + data.type + ")");
                    break;

            }
        }

        // Scroll 'chatLog' to the bottom
        // chatLog.scrollTop = chatLog.scrollHeight;

        chatSocket.onerror = function(err) {
            console.log("Websocket encountered an error: " + err.message);
            console.log("Closing the socket");
            chatSocket.close();
        }    
    }

    connect();

    onlineUsersSelector.onchange = function() {
        chatMessageInput.value = "/pm " + onlineUsersSelector.value + " ";
        onlineUsersSelector.value = null;
        chatMessageInput.focus();
    }
}