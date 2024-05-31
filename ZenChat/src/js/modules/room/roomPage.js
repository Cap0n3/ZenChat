import { scrollDown } from "../common/chat_utils";
import { handleFormSubmit } from "./helpers/form_handler";
import { connectWebSocket } from "../common/websocket";
import { 
    createMessageElement, 
    createSystemMessageElement,
    onlineUsersSelectorAdd,
    onlineUsersSelectorRemove,
} from "./helpers/dom_helpers";
import { 
    addEventListenersToButtons, 
    removeEventListenersFromButtons 
} from "./helpers/buttonEvt_helpers";


export function roomPage() {
    console.log("Sanity check from roomPage().");

    // ======================//
    // === Initialization ===//
    // ======================//

    // Get DOM elements
    const roomName = JSON.parse(document.getElementById('roomName').textContent);
    const chatFeedInner = document.getElementById("chatFeed");
    const scrollerInner = document.getElementById("scroller-inner");
    const chatMessageInput = document.getElementById("chatMessageInput");
    const onlineUsersSelector = document.getElementById("onlineUsersSelector");
    chatMessageInput.focus();

    // Remove old event listeners and add new ones
    const chatMessages = document.querySelectorAll(".message-container");
    chatMessages.forEach(message => {
        removeEventListenersFromButtons(message);
        addEventListenersToButtons(message);
    });

    //===============================//
    //=== Websocket communication ===//
    //===============================//

    const handlers = {
        onOpen: () => console.log("Connected to WebSocket."),
        onMessage: (e) => handleWebSocketMessage(e),
        onError: (err) => handleWebSocketError(err)
    };

    // Initialize WebSocket
    let ws = null;
    ws = connectWebSocket(`ws://${window.location.host}/ws/chat/${roomName}/`, handlers);

    // Handle WebSocket messages
    function handleWebSocketMessage(e) {
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
                break;
            case "private_message_delivered":
                // TODO: handle private message delivery
                break;
            default:
                console.error("Unknown message type: " + data.type);
                break;
        }
    }

    // ================================ //
    // === Form submission handler === //
    // ================================ //

    const form = document.getElementById("chatInputForm");
    handleFormSubmit(form, chatMessageInput, ws);

    //==================================//
    //=== Websocket message handlers ===//
    //==================================//

    function handleWebSocketError(err) {
        console.error("WebSocket error: " + err.message);
        console.error("Closing socket.");
        ws.close();
    }

    function handleChatMessage(data) {
        const messageElement = createMessageElement(data, JSON.parse(sessionStorage.getItem("user-id")));
        scrollerInner.insertAdjacentElement("beforeend", messageElement);
        const insertedElement = document.getElementById(messageElement.id);
        addEventListenersToButtons(insertedElement);
        scrollDown(chatFeedInner);
    }

    function handleUserList(data) {
        // Set storage session with curent user list
        sessionStorage.setItem("user-id", JSON.stringify(data.current_user_id));
        data.users.forEach(user => onlineUsersSelectorAdd(onlineUsersSelector, user));
    }

    function handleUserJoin(data) {
        const messageElement = createSystemMessageElement(`${data.username} joined the room`);
        scrollerInner.insertAdjacentHTML("beforeend", messageElement.outerHTML);
        onlineUsersSelectorAdd(onlineUsersSelector, data.username);
        scrollDown(chatFeedInner);
    }

    function handleUserLeave(data) {
        const messageElement = createSystemMessageElement(`${data.username} left the room`);
        scrollerInner.insertAdjacentHTML("beforeend", messageElement.outerHTML);
        onlineUsersSelectorRemove(onlineUsersSelector, data.username);
        scrollDown(chatFeedInner);
    }
}