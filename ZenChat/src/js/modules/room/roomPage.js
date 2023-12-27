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

    // focus 'chatMessageInput' when user opens the page
    chatMessageInput.focus();

    const form = document.getElementById("chatInputForm");

    form.addEventListener("submit", handleSubmit);


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
                    // TODO: handle private message
                    //handlePrivateMessage(data);
                    break;
                case "private_message_delivered":
                    // TODO: handle private message delivery
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

    // TODO: implement private messaging
    // onlineUsersSelector.onchange = function() {
    //     chatMessageInput.value = "/pm " + onlineUsersSelector.value + " ";
    //     onlineUsersSelector.value = null;
    //     chatMessageInput.focus();
    // }

    connect();
}