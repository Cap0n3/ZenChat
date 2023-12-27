import { scrollDown } from "./chat_utils";

export function roomPage() {
    console.log("Sanity check from roomPage().");
    
    let ws = null;
    const roomName = JSON.parse(document.getElementById('roomName').textContent);
    const chatFeedInner = document.getElementById("chatFeed");
    const scrollerInner = document.getElementById("scroller-inner");
    const chatMessageInput = document.getElementById("chatMessageInput");
    const onlineUsersSelector = document.getElementById("onlineUsersSelector");
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
        // Set storage session with curent user list
        sessionStorage.setItem("user-id", JSON.stringify(data.current_user_id));
        
        for (let i = 0; i < data.users.length; i++) {
            onlineUsersSelectorAdd(data.users[i]);
        }
    }

    function handleUserJoin(data) {
        const messageElement = document.createElement("li");
        messageElement.classList.add("message-container");

        const joinedUserElement = document.createElement("div");
        joinedUserElement.classList.add("chat-joined-user");
        joinedUserElement.textContent = `--- ${data.username} joined the room ---`;
        messageElement.appendChild(joinedUserElement);

        scrollerInner.insertAdjacentHTML("beforeend", messageElement.outerHTML);
        onlineUsersSelectorAdd(data.username);
        scrollDown(chatFeedInner);
    }

    function handleUserLeave(data) {
        const messageElement = document.createElement("li");
        messageElement.classList.add("message-container");

        const leftUserElement = document.createElement("div");
        leftUserElement.classList.add("chat-joined-user");
        leftUserElement.textContent = `--- ${data.username} left the room ---`;
        messageElement.appendChild(leftUserElement);

        scrollerInner.insertAdjacentHTML("beforeend", messageElement.outerHTML);
        onlineUsersSelectorRemove(data.username);
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
     * * // HTML returned by this function:
     * // <li id="msg_123" class="message-container" data-user-id="23">
     * //   <img src="avatar.jpg" alt="avatar" class="user-avatar" width="50" height="50">
     * //   <h3 class="chat-user">John Doe <span class="timestamp">2022-01-01 12:00:00</span></h3>
     * //   <div class="message-content">Hello, world!</div>
     * //   <div class="toolbar btn-group">
     * //     <button class="btn btn-outline-dark" type="button" id="editMessage" data-nonce="123">
     * //       <i class="bi bi-pencil-fill"></i>
     * //     </button>
     * //     <button class="btn btn-outline-dark" type="button" id="respondMessage" data-nonce="123">
     * //       <i class="bi bi-arrow-90deg-left"></i>
     * //     </button>
     * //     <button class="btn btn-outline-dark" type="button" id="deleteMessage" data-nonce="123">
     * //       <i class="bi bi-trash-fill"></i>
     * //     </button>
     * //   </div>
     * // </li>
     * 
     */
    function createMessageElement(data) {
        // Get current user id from session storage
        const currentUserId = JSON.parse(sessionStorage.getItem("user-id"));

        // Create message container
        const messageElement = document.createElement("li");
        messageElement.id = data.nonce;
        messageElement.classList.add("message-container");
        messageElement.setAttribute("data-user-id", data.user_id);
    
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
        userInfoElement.textContent = data.username + " ";
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

        // Add toolbar
        const toolbarElement = document.createElement("div");
        toolbarElement.classList.add("toolbar", "btn-group");

        // if the message is from the current user, add edit and delete buttons
        if (data.user_id === currentUserId) {
            console.log("Message from current user.");
        
            const editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-outline-dark");
            editButton.type = "button";
            editButton.id = "editMessage";
            editButton.setAttribute("data-nonce", data.nonce);
            editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
            toolbarElement.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-outline-dark");
            deleteButton.type = "button";
            deleteButton.id = "deleteMessage";
            deleteButton.setAttribute("data-nonce", data.nonce);
            deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
            toolbarElement.appendChild(deleteButton);
        }
        
        const respondButton = document.createElement("button");
        respondButton.classList.add("btn", "btn-outline-dark");
        respondButton.type = "button";
        respondButton.id = "respondMessage";
        respondButton.setAttribute("data-nonce", data.nonce);
        respondButton.innerHTML = '<i class="bi bi-arrow-90deg-left"></i>';
        toolbarElement.appendChild(respondButton);

        messageElement.appendChild(toolbarElement);
    
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