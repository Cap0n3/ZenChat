/**
 * Creates a new message element.
 * @param {Object} data - The message data. 
 * @param {currentUser} currentUserId - The ID of the current user.
 * @returns {string} The message element as a string.
 * 
 * // HTML returned by this function:
 * <li id="msg_123" class="message-container" data-user-id="23">
 *    <img src="avatar.jpg" alt="avatar" class="user-avatar" width="50" height="50">
 *    <h3 class="chat-user">John Doe <span class="timestamp">2022-01-01 12:00:00</span></h3>
 *    <div class="message-content">Hello, world!</div>
 *    <div class="toolbar btn-group">
 *      <button class="btn btn-outline-dark" type="button" id="editMessage" data-nonce="123">
 *        <i class="bi bi-pencil-fill"></i>
 *      </button>
 *      <button class="btn btn-outline-dark" type="button" id="respondMessage" data-nonce="123">
 *        <i class="bi bi-arrow-90deg-left"></i>
 *      </button>
 *      <button class="btn btn-outline-dark" type="button" id="deleteMessage" data-nonce="123">
 *        <i class="bi bi-trash-fill"></i>
 *      </button>
 *    </div>
 * </li>
 * 
 */
export function createMessageElement(data, currentUserId) {

    // Create toolbar buttons function (DRY)
    function createToolbarButton(id, iconClass, nonce) {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-outline-dark");
        button.type = "button";
        button.id = id;
        button.setAttribute("data-nonce", nonce);
        button.innerHTML = `<i class="${iconClass}"></i>`;
        return button;
    }

    // Create message container
    const messageElement = document.createElement("li");
    messageElement.id = data.nonce;
    messageElement.classList.add("message-container");
    messageElement.setAttribute("data-user-id", data.user_id);

    // Create user avatar
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
    userInfoElement.textContent = `${data.username} `;
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
        const editButton = createToolbarButton("editMessage", "bi bi-pencil-fill", data.nonce);
        const deleteButton = createToolbarButton("deleteMessage", "bi bi-trash-fill", data.nonce);
        toolbarElement.appendChild(editButton);
        toolbarElement.appendChild(deleteButton);
    }

    const respondButton = createToolbarButton("respondMessage", "bi bi-arrow-90deg-left", data.nonce);
    toolbarElement.appendChild(respondButton);

    messageElement.appendChild(toolbarElement);
    return messageElement.outerHTML;
}

export function createSystemMessageElement(message) {
    const messageElement = document.createElement("li");
    messageElement.classList.add("message-container");

    const systemMessageElement = document.createElement("div");
    systemMessageElement.classList.add("chat-system-message");
    systemMessageElement.textContent = `--- ${message} ---`;

    messageElement.appendChild(systemMessageElement);
    return messageElement;
}

// Adds a new option to 'onlineUsersSelector'
export function onlineUsersSelectorAdd(selector, value) {
    if (!document.querySelector(`option[value='${value}']`)) {
        const newOption = document.createElement("option");
        newOption.value = value;
        newOption.innerHTML = value;
        selector.appendChild(newOption);
    }
}

export function onlineUsersSelectorRemove(selector, value) {
    const oldOption = document.querySelector(`option[value='${value}']`);
    if (oldOption) oldOption.remove();
}
