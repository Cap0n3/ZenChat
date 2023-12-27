import { scrollDown } from "./chat_utils";

export function roomPage() {
    console.log("Sanity check from roomPage().");
    
    let ws = null;
    const roomName = JSON.parse(document.getElementById('roomName').textContent);
    const chatFeedInner = document.getElementById("chatFeed");
    const scrollerInner = document.getElementById("scroller-inner");
    const chatMessageInput = document.getElementById("chatMessageInput");
    const chatMessageSend = document.getElementById("chatMessageSend");
    const onlineUsersSelector = document.getElementById("onlineUsersSelector");
    
    // Event listeners
    chatMessageSend.addEventListener("click", handleSubmit);
    chatMessageInput.addEventListener("keyup", function(e) {
        if (e.key === "Enter") {  // enter key
            handleSubmit(e);
        }
    });

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        
        const message = chatMessageInput.value.trim();
        if (!message) return;

        // Check for exessive message length
        if (message.length > 10000) {
            console.error("Message too long.");
            return;
        }

        // Send message via WebSocket
        console.log("Sending message: " + message);
        ws.send(JSON.stringify({
            "message": message
        }));
        chatMessageInput.value = "";
    }

    
    //===============================//
    //=== Websocket communication ===//
    //===============================//

    function connect() {
        ws = new WebSocket("ws://" + window.location.host + "/ws/chat/" + roomName + "/");
        ws.onopen = () => {
            console.log("Connected to WebSocket.");
        };
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data);
    
            switch (data.type) {
                case "chat_message":
                    handleChatMessage(data);
                    break;
                case "user_list":
                    handleUserList(data);
                    break;
                case "user_join":
                    handleUserJoin(data);
                    break;
                case "user_leave":
                    handleUserLeave(data);
                    break;
                case "private_message":
                    handlePrivateMessage(data);
                    break;
                case "private_message_delivered":
                    // handle private message delivery
                    break;
                default:
                    console.error("Unknown message type: " + data.type);
                    break;
            }
        };
        ws.onerror = (err) => {
            console.error("WebSocket error: " + err.message);
            console.error("Closing socket.");
            ws.close();
        };
    }
    
    //==================================//
    //=== Websocket message handlers ===//
    //==================================//

    function handleChatMessage(data) {
        const messageElement = createMessageElement(data);
        scrollerInner.insertAdjacentHTML("beforeend", messageElement);
        scrollDown(chatFeedInner);
    }

    function handleUserList(data) {
        for (let i = 0; i < data.users.length; i++) {
            onlineUsersSelectorAdd(data.users[i]);
        }
    }

    function handleUserJoin(data) {
        const messageElement = document.createElement("li");
        messageElement.classList.add("message-container");

        const joinedUserElement = document.createElement("div");
        joinedUserElement.classList.add("chat-joined-user");
        joinedUserElement.textContent = `--- ${data.user} joined the room ---`;
        messageElement.appendChild(joinedUserElement);

        scrollerInner.insertAdjacentHTML("beforeend", messageElement.outerHTML);
        onlineUsersSelectorAdd(data.user);
        scrollDown(chatFeedInner);
    }

    function handleUserLeave(data) {
        const messageElement = document.createElement("li");
        messageElement.classList.add("message-container");

        const leftUserElement = document.createElement("div");
        leftUserElement.classList.add("chat-joined-user");
        leftUserElement.textContent = `--- ${data.user} left the room ---`;
        messageElement.appendChild(leftUserElement);

        scrollerInner.insertAdjacentHTML("beforeend", messageElement.outerHTML);
        onlineUsersSelectorRemove(data.user);
        scrollDown(chatFeedInner);
    }


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


    /**
     * Creates a new message element.
     * @param {Object} data - The message data. 
     * @returns {string} The message element as a string.
     * 
     * @example
     * returns "
     * <li id="msg_1234567890" class="message-container">
     *      <img class="user-avatar" src="https://www.gravatar.com/avatar/1234567890" alt="avatar" width="50" height="50">
     *  <h3 class="chat-user">
     *      <span class="timestamp">12:34</span>
     *  </h3>
     * </li>"
     */
    function createMessageElement(data) {
        // Create message container
        const messageElement = document.createElement("li");
        messageElement.id = "msg_" + data.nonce;
        messageElement.classList.add("message-container");
    
        // Add user avatar
        const avatarElement = document.createElement("img");
        avatarElement.src = data.avatar;
        avatarElement.alt = "avatar";
        avatarElement.classList.add("user-avatar");
        avatarElement.width = 50;
        avatarElement.height = 50;
        messageElement.appendChild(avatarElement);
    
        // Add username title and timestamp
        const userInfoElement = document.createElement("h3");
        userInfoElement.classList.add("chat-user");
        const timestampElement = document.createElement("span");
        timestampElement.classList.add("timestamp");
        timestampElement.textContent = data.timestamp;
        userInfoElement.appendChild(timestampElement);
        messageElement.appendChild(userInfoElement);
    
        // Add message content
        const messageContentElement = document.createElement("div");
        messageContentElement.classList.add("message-content");
        messageContentElement.textContent = data.message;
        messageElement.appendChild(messageContentElement);
    
        return messageElement.outerHTML;
    }

    //=== Websocket communication ===//

    // let chatSocket = null;

    // function connect(){
    //     chatSocket = new WebSocket("ws://" + window.location.host + "/ws/chat/" + roomName + "/");
        
    //     chatSocket.onopen = function(e) {
    //         console.log("Successfully connected to the Websocket.")
    //     }

    //     chatSocket.onclose = function(e) {
    //         console.log("Websocket connection closed unexpectedly. Trying to reconnect in 2s...");
    //         setTimeout(function() {
    //             console.log("Reconnecting...");
    //             connect();
    //         }, 2000);
    //     }

    //     chatSocket.onmessage = function(e) {
    //         const data = JSON.parse(e.data);
    //         console.log(data);

    //         switch(data.type) {
    //             case "chat_message":
    //                 scrollerInner.insertAdjacentHTML(
    //                     "beforeend",    
    //                     `
    //                     <li id="msg_${data.nonce}">
    //                         <div class="message-container">
    //                             <img class="user-avatar" src="${data.avatar}" alt="avatar">
    //                             <h3 class="chat-user">${data.user} <span class="timestamp">${data.timestamp}</span></h3>
    //                             <div class="message-content">${data.message}</div>
    //                         </div>
    //                     </li>
    //                     `    
    //                 );
    //                 scrollDown(chatFeed);
    //                 break;
    //             case "user_list":
    //                 for (let i = 0; i < data.users.length; i++) {
    //                     onlineUsersSelectorAdd(data.users[i]);
    //                 }
    //                 break;
    //             case "user_join":
    //                 scrollerInner.insertAdjacentHTML(
    //                     "beforeend", 
    //                     //"<li><span class='chat-joined-user'><i>" + data.user + "</span> joined the room.</i></li>"
    //                     `
    //                     <li>
    //                         <div class="message-container">
    //                             <div class="chat-joined-user">--- ${data.user} joined the room ---</div>
    //                         </div>
    //                     </li>
    //                     `
    //                 );
    //                 onlineUsersSelectorAdd(data.user);
    //                 scrollDown(chatFeed);
    //                 break;
    //             case "user_leave":
    //                 // chatLog.value += data.user + " left the room.\n";
    //                 scrollerInner.insertAdjacentHTML(
    //                     "beforeend", 
    //                     //"<li><span class='chat-joined-user'><i>" + data.user + "</span> joined the room.</i></li>"
    //                     `
    //                     <li>
    //                         <div class="message-container">
    //                             <div class="chat-joined-user">--- ${data.user} left the room ---</div>
    //                         </div>
    //                     </li>
    //                     `
    //                 );
    //                 onlineUsersSelectorRemove(data.user);
    //                 scrollDown(chatFeed);
    //                 break;
    //             case "private_message":
    //                 // chatLog.value += "PM from " + data.user + ": " + data.message + "\n";
    //                 break;
    //             case "private_message_delivered":
    //                 // chatLog.value += "PM to " + data.target + ": " + data.message + "\n";
    //                 break;
    //             default:
    //                 //console.error("Unknown message type !");
    //                 console.error("Unknown message type ! \n(data.type = " + data.type + ")");
    //                 break;

    //         }
    //     }

        // Scroll 'chatLog' to the bottom
        // chatLog.scrollTop = chatLog.scrollHeight;

    //     chatSocket.onerror = function(err) {
    //         console.log("Websocket encountered an error: " + err.message);
    //         console.log("Closing the socket");
    //         chatSocket.close();
    //     }    
    // }

    connect();

    // TODO: implement private messaging
    // onlineUsersSelector.onchange = function() {
    //     chatMessageInput.value = "/pm " + onlineUsersSelector.value + " ";
    //     onlineUsersSelector.value = null;
    //     chatMessageInput.focus();
    // }
}