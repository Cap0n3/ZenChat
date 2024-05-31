/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ZenChat/src/js/main.js":
/*!********************************!*\
  !*** ./ZenChat/src/js/main.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_home_serverPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/home/serverPage */ \"./ZenChat/src/js/modules/home/serverPage.js\");\n/* harmony import */ var _modules_room_roomPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/room/roomPage */ \"./ZenChat/src/js/modules/room/roomPage.js\");\n/* harmony import */ var _modules_common_chat_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/common/chat_utils */ \"./ZenChat/src/js/modules/common/chat_utils.js\");\n\n\n\n\nfunction initialize() {\n    console.log(\"Sanity check from main.js.\");\n    const currentPage = window.location.pathname;\n    \n    if(currentPage.match(/^\\/server\\/\\d+\\/$/)) {\n        (0,_modules_home_serverPage__WEBPACK_IMPORTED_MODULE_0__.serverPage)(currentPage);\n    }\n    else if(currentPage.match(/^\\/server\\/\\d+\\/\\w+\\/$/)) {\n        console.log(\"Room page.\");\n        (0,_modules_room_roomPage__WEBPACK_IMPORTED_MODULE_1__.roomPage)();\n        (0,_modules_common_chat_utils__WEBPACK_IMPORTED_MODULE_2__.scrollDown)(document.querySelector(\"#chatFeed\"));\n    }\n    else {\n        console.log(\"Page not found.\");\n    }\n}\n\nwindow.onload = initialize;\n\n//# sourceURL=webpack:///./ZenChat/src/js/main.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/common/chat_utils.js":
/*!*****************************************************!*\
  !*** ./ZenChat/src/js/modules/common/chat_utils.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   scrollDown: () => (/* binding */ scrollDown)\n/* harmony export */ });\n// Scroll to the bottom of the chat container\nfunction scrollDown(container) {\n    if (container == null) {\n        console.error(\"ScrollDown(): container is null.\");\n        return;\n    }\n    container.scrollTop = container.scrollHeight;\n}\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/common/chat_utils.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/common/websocket.js":
/*!****************************************************!*\
  !*** ./ZenChat/src/js/modules/common/websocket.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectWebSocket: () => (/* binding */ connectWebSocket)\n/* harmony export */ });\nfunction connectWebSocket(url, handlers) {\n    const ws = new WebSocket(url);\n    \n    ws.onopen = handlers.onOpen || (() => console.log(\"Connected to WebSocket.\"));\n    ws.onmessage = handlers.onMessage || ((e) => console.log(JSON.parse(e.data)));\n    ws.onerror = handlers.onError || ((err) => {\n        console.error(\"WebSocket error: \" + err.message);\n        ws.close();\n    });\n\n    return ws;\n}\n\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/common/websocket.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/home/serverPage.js":
/*!***************************************************!*\
  !*** ./ZenChat/src/js/modules/home/serverPage.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   serverPage: () => (/* binding */ serverPage)\n/* harmony export */ });\nfunction serverPage(currentURL) {\n    console.log(\"Sanity check from homePage().\");\n\n    // focus 'roomInput' when user opens the page\n    document.querySelector(\"#roomInput\").focus();\n    \n    // submit if the user presses the enter key\n    document.querySelector(\"#roomInput\").onkeyup = function(e) {\n        if (e.keyCode === 13) {  // enter key\n            document.querySelector(\"#roomConnect\").click();\n        }\n    };\n    \n    // redirect to '/room/<roomInput>/'\n    document.querySelector(\"#roomConnect\").onclick = function() {\n        let roomName = document.querySelector(\"#roomInput\").value;\n        window.location.pathname = currentURL + roomName + \"/\";\n    }\n    \n    // redirect to '/room/<roomSelect>/'\n    document.querySelector(\"#roomSelect\").onchange = function() {\n        let roomName = document.querySelector(\"#roomSelect\").value.split(\" (\")[0];\n        window.location.pathname = currentURL + roomName + \"/\";\n    }    \n}\n\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/home/serverPage.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/room/helpers/buttonEvt_helpers.js":
/*!******************************************************************!*\
  !*** ./ZenChat/src/js/modules/room/helpers/buttonEvt_helpers.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addEventListenersToButtons: () => (/* binding */ addEventListenersToButtons),\n/* harmony export */   handleDelete: () => (/* binding */ handleDelete),\n/* harmony export */   handleEdit: () => (/* binding */ handleEdit),\n/* harmony export */   handleRespond: () => (/* binding */ handleRespond),\n/* harmony export */   removeEventListenersFromButtons: () => (/* binding */ removeEventListenersFromButtons)\n/* harmony export */ });\nfunction addEventListenersToButtons(element) {\n    // Get message author\n    const messageAuthor = element.querySelector(\".chat-user\").firstChild;\n    // Get message content\n    const messageContent = element.querySelector(\".message-content\");\n    // Get all buttons inside element\n    const buttons = element.querySelectorAll(\"button\");\n\n    // Add event listener to each button\n    buttons.forEach(button => {\n        const classes = button.classList;\n        const nonce = button.getAttribute(\"data-nonce\");\n\n        if (classes.contains(\"editMessage\")) {\n            button.addEventListener(\"click\", handleEdit);\n        } else if (classes.contains(\"deleteMessage\")) {\n            button.addEventListener(\"click\", handleDelete);\n        } else if (classes.contains(\"respondMessage\")) {\n            button.addEventListener(\"click\", handleRespond);\n        } else {\n            console.error(\"Button class not found, check your code.\");\n        }\n\n        // Store important data in button dataset for action handling\n        button.dataset.author = messageAuthor.textContent;\n        button.dataset.messageContent = messageContent.textContent;\n        button.dataset.nonce = nonce;\n    });\n}\n\nfunction removeEventListenersFromButtons(element) {\n    // Get all buttons inside element\n    const buttons = element.querySelectorAll(\"button\");\n\n    // Remove event listener from each button\n    buttons.forEach(button => {\n        const classes = button.classList;\n\n        if (classes.contains(\"editMessage\")) {\n            button.removeEventListener(\"click\", handleEdit);\n        } else if (classes.contains(\"deleteMessage\")) {\n            button.removeEventListener(\"click\", handleDelete);\n        } else if (classes.contains(\"respondMessage\")) {\n            button.removeEventListener(\"click\", handleRespond);\n        } else {\n            console.error(\"Button class not found for removal, check your code.\");\n        }\n    });\n}\n\nfunction handleEdit(event) {\n    const nonce = event.currentTarget.dataset.nonce;\n    console.log(\"Edit message with nonce: \" + nonce);\n}\n\nfunction handleDelete(event) {\n    const nonce = event.currentTarget.dataset.nonce;\n    console.log(\"Delete message with nonce: \" + nonce);\n}\n\nfunction handleRespond(event) {\n    const author = event.currentTarget.dataset.author;\n    const message = event.currentTarget.dataset.messageContent;\n    const nonce = event.currentTarget.dataset.nonce;\n    const replyInput = document.getElementById(\"reply-input\");\n    const hiddenReplyNonce = document.getElementById(\"reply-nonce\");\n    replyInput.classList.replace(\"d-none\", \"d-block\");\n    // scroll to replyInput\n    replyInput.scrollIntoView({behavior: \"smooth\"});\n    replyInput.value = `↩️ Reply to ${author}: ${message}`;\n    hiddenReplyNonce.value = nonce;\n    console.log(`Respond to message from ${author}: ${message} with nonce: ${nonce}`);\n}\n\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/room/helpers/buttonEvt_helpers.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/room/helpers/dom_helpers.js":
/*!************************************************************!*\
  !*** ./ZenChat/src/js/modules/room/helpers/dom_helpers.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createMessageElement: () => (/* binding */ createMessageElement),\n/* harmony export */   createSystemMessageElement: () => (/* binding */ createSystemMessageElement),\n/* harmony export */   onlineUsersSelectorAdd: () => (/* binding */ onlineUsersSelectorAdd),\n/* harmony export */   onlineUsersSelectorRemove: () => (/* binding */ onlineUsersSelectorRemove)\n/* harmony export */ });\n/**\n * Creates a new message element.\n * @param {Object} data - The message data. \n * @param {currentUser} currentUserId - The ID of the current user.\n * @returns {string} The message element as a string.\n * \n * // HTML returned by this function:\n * <li id=\"msg_123\" class=\"message-container\" data-user-id=\"23\">\n *    <img src=\"avatar.jpg\" alt=\"avatar\" class=\"user-avatar\" width=\"50\" height=\"50\">\n *    <h3 class=\"chat-user\">John Doe <span class=\"timestamp\">2022-01-01 12:00:00</span></h3>\n *    <div class=\"message-content\">Hello, world!</div>\n *    <div class=\"toolbar btn-group\">\n *      <button class=\"btn btn-outline-dark\" type=\"button\" id=\"editMessage\" data-nonce=\"123\">\n *        <i class=\"bi bi-pencil-fill\"></i>\n *      </button>\n *      <button class=\"btn btn-outline-dark\" type=\"button\" id=\"respondMessage\" data-nonce=\"123\">\n *        <i class=\"bi bi-arrow-90deg-left\"></i>\n *      </button>\n *      <button class=\"btn btn-outline-dark\" type=\"button\" id=\"deleteMessage\" data-nonce=\"123\">\n *        <i class=\"bi bi-trash-fill\"></i>\n *      </button>\n *    </div>\n * </li>\n * \n */\nfunction createMessageElement(data, currentUserId) { \n\n    // Create toolbar buttons function (DRY)\n    function createToolbarButton(id, iconClass, nonce, callbackFunc=null) {\n        const button = document.createElement(\"button\");\n        button.classList.add(\"btn\", \"btn-outline-dark\", `${id}`);\n        button.type = \"button\";\n        button.id = `${id}-${nonce}`;\n        button.setAttribute(\"data-nonce\", nonce);\n        button.innerHTML = `<i class=\"${iconClass}\"></i>`;\n        return button;\n    }\n\n    // Create message container\n    const messageElement = document.createElement(\"li\");\n    messageElement.id = data.nonce;\n    messageElement.classList.add(\"message-container\");\n    messageElement.setAttribute(\"data-user-id\", data.user_id);\n\n    // Create user avatar\n    const avatarElement = document.createElement(\"img\");\n    avatarElement.src = data.avatar;\n    avatarElement.alt = \"avatar\";\n    avatarElement.classList.add(\"user-avatar\");\n    avatarElement.width = 50;\n    avatarElement.height = 50;\n    messageElement.appendChild(avatarElement);\n\n    // Add username title and timestamp\n    const userInfoElement = document.createElement(\"h3\");\n    userInfoElement.classList.add(\"chat-user\");\n    userInfoElement.textContent = `${data.username} `;\n    const timestampElement = document.createElement(\"span\");\n    timestampElement.classList.add(\"timestamp\");\n    timestampElement.textContent = data.timestamp;\n    userInfoElement.appendChild(timestampElement);\n    messageElement.appendChild(userInfoElement);\n\n    // Add message content\n    const messageContentElement = document.createElement(\"div\");\n    messageContentElement.classList.add(\"message-content\");\n    messageContentElement.textContent = data.message;\n    messageElement.appendChild(messageContentElement);\n\n    // Add toolbar\n    const toolbarElement = document.createElement(\"div\");\n    toolbarElement.classList.add(\"toolbar\", \"btn-group\");\n\n    // if the message is from the current user, add edit and delete buttons\n    if (data.user_id === currentUserId) {\n        const editButton = createToolbarButton(\n            \"editMessage\", \n            \"bi bi-pencil-fill\", \n            data.nonce    \n        );\n        const deleteButton = createToolbarButton(\n            \"deleteMessage\", \n            \"bi bi-trash-fill\", \n            data.nonce\n        );\n        toolbarElement.appendChild(editButton);\n        toolbarElement.appendChild(deleteButton);\n    }\n\n    const respondButton = createToolbarButton(\"respondMessage\", \"bi bi-arrow-90deg-left\", data.nonce);\n    toolbarElement.appendChild(respondButton);\n\n    messageElement.appendChild(toolbarElement);\n    \n    return messageElement;\n}\n\n/**\n * Chat system message to all users of a room (in chat feed)\n * \n * @param {*} message - The message.\n * @returns \n */\nfunction createSystemMessageElement(message) {\n    const messageElement = document.createElement(\"li\");\n    messageElement.classList.add(\"message-container\");\n\n    const systemMessageElement = document.createElement(\"div\");\n    systemMessageElement.classList.add(\"chat-system-message\", \"text-success\");\n    systemMessageElement.textContent = `--- ${message} ---`;\n\n    messageElement.appendChild(systemMessageElement);\n    return messageElement;\n}\n\n// Adds a new option to 'onlineUsersSelector'\nfunction onlineUsersSelectorAdd(selector, value) {\n    if (!document.querySelector(`option[value='${value}']`)) {\n        const newOption = document.createElement(\"option\");\n        newOption.value = value;\n        newOption.innerHTML = value;\n        selector.appendChild(newOption);\n    }\n}\n\n// Removes an option from 'onlineUsersSelector'\nfunction onlineUsersSelectorRemove(selector, value) {\n    const oldOption = document.querySelector(`option[value='${value}']`);\n    if (oldOption) oldOption.remove();\n}\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/room/helpers/dom_helpers.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/room/helpers/form_handler.js":
/*!*************************************************************!*\
  !*** ./ZenChat/src/js/modules/room/helpers/form_handler.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handleFormSubmit: () => (/* binding */ handleFormSubmit)\n/* harmony export */ });\nfunction handleFormSubmit(form, input, ws) {\n    form.addEventListener(\"submit\", (e) => {\n        e.preventDefault();\n        const message = input.value.trim();\n\n        if (!message) return;\n\n        if (message.length > 10000) {\n            console.error(\"Message too long.\");\n            return;\n        }\n\n        ws.send(JSON.stringify({ \"message\": message }));\n        input.value = \"\";\n    });\n}\n\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/room/helpers/form_handler.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/room/roomPage.js":
/*!*************************************************!*\
  !*** ./ZenChat/src/js/modules/room/roomPage.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   roomPage: () => (/* binding */ roomPage)\n/* harmony export */ });\n/* harmony import */ var _common_chat_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/chat_utils */ \"./ZenChat/src/js/modules/common/chat_utils.js\");\n/* harmony import */ var _helpers_form_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/form_handler */ \"./ZenChat/src/js/modules/room/helpers/form_handler.js\");\n/* harmony import */ var _common_websocket__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/websocket */ \"./ZenChat/src/js/modules/common/websocket.js\");\n/* harmony import */ var _helpers_dom_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/dom_helpers */ \"./ZenChat/src/js/modules/room/helpers/dom_helpers.js\");\n/* harmony import */ var _helpers_buttonEvt_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/buttonEvt_helpers */ \"./ZenChat/src/js/modules/room/helpers/buttonEvt_helpers.js\");\n\n\n\n\n\n\n\nfunction roomPage() {\n    console.log(\"Sanity check from roomPage().\");\n\n    // ======================//\n    // === Initialization ===//\n    // ======================//\n\n    // Get DOM elements\n    const roomName = JSON.parse(document.getElementById('roomName').textContent);\n    const chatFeedInner = document.getElementById(\"chatFeed\");\n    const scrollerInner = document.getElementById(\"scroller-inner\");\n    const chatMessageInput = document.getElementById(\"chatMessageInput\");\n    const onlineUsersSelector = document.getElementById(\"onlineUsersSelector\");\n    chatMessageInput.focus();\n\n    // Remove old event listeners and add new ones\n    const chatMessages = document.querySelectorAll(\".message-container\");\n    chatMessages.forEach(message => {\n        (0,_helpers_buttonEvt_helpers__WEBPACK_IMPORTED_MODULE_4__.removeEventListenersFromButtons)(message);\n        (0,_helpers_buttonEvt_helpers__WEBPACK_IMPORTED_MODULE_4__.addEventListenersToButtons)(message);\n    });\n\n    //===============================//\n    //=== Websocket communication ===//\n    //===============================//\n\n    const handlers = {\n        onOpen: () => console.log(\"Connected to WebSocket.\"),\n        onMessage: (e) => handleWebSocketMessage(e),\n        onError: (err) => handleWebSocketError(err)\n    };\n\n    // Initialize WebSocket\n    let ws = null;\n    ws = (0,_common_websocket__WEBPACK_IMPORTED_MODULE_2__.connectWebSocket)(`ws://${window.location.host}/ws/chat/${roomName}/`, handlers);\n\n    // Handle WebSocket messages\n    function handleWebSocketMessage(e) {\n        const data = JSON.parse(e.data);\n        console.log(data);\n\n        switch (data.type) {\n            case \"chat_message\":\n                handleChatMessage(data);\n                break;\n            case \"user_list\":\n                handleUserList(data);\n                break;\n            case \"user_join\":\n                handleUserJoin(data);\n                break;\n            case \"user_leave\":\n                handleUserLeave(data);\n                break;\n            case \"private_message\":\n                // TODO: handle private message\n                break;\n            case \"private_message_delivered\":\n                // TODO: handle private message delivery\n                break;\n            default:\n                console.error(\"Unknown message type: \" + data.type);\n                break;\n        }\n    }\n\n    // ================================ //\n    // === Form submission handler === //\n    // ================================ //\n\n    const form = document.getElementById(\"chatInputForm\");\n    (0,_helpers_form_handler__WEBPACK_IMPORTED_MODULE_1__.handleFormSubmit)(form, chatMessageInput, ws);\n\n    //==================================//\n    //=== Websocket message handlers ===//\n    //==================================//\n\n    function handleWebSocketError(err) {\n        console.error(\"WebSocket error: \" + err.message);\n        console.error(\"Closing socket.\");\n        ws.close();\n    }\n\n    function handleChatMessage(data) {\n        const messageElement = (0,_helpers_dom_helpers__WEBPACK_IMPORTED_MODULE_3__.createMessageElement)(data, JSON.parse(sessionStorage.getItem(\"user-id\")));\n        scrollerInner.insertAdjacentElement(\"beforeend\", messageElement);\n        const insertedElement = document.getElementById(messageElement.id);\n        (0,_helpers_buttonEvt_helpers__WEBPACK_IMPORTED_MODULE_4__.addEventListenersToButtons)(insertedElement);\n        (0,_common_chat_utils__WEBPACK_IMPORTED_MODULE_0__.scrollDown)(chatFeedInner);\n    }\n\n    function handleUserList(data) {\n        // Set storage session with curent user list\n        sessionStorage.setItem(\"user-id\", JSON.stringify(data.current_user_id));\n        data.users.forEach(user => (0,_helpers_dom_helpers__WEBPACK_IMPORTED_MODULE_3__.onlineUsersSelectorAdd)(onlineUsersSelector, user));\n    }\n\n    function handleUserJoin(data) {\n        const messageElement = (0,_helpers_dom_helpers__WEBPACK_IMPORTED_MODULE_3__.createSystemMessageElement)(`${data.username} joined the room`);\n        scrollerInner.insertAdjacentHTML(\"beforeend\", messageElement.outerHTML);\n        (0,_helpers_dom_helpers__WEBPACK_IMPORTED_MODULE_3__.onlineUsersSelectorAdd)(onlineUsersSelector, data.username);\n        (0,_common_chat_utils__WEBPACK_IMPORTED_MODULE_0__.scrollDown)(chatFeedInner);\n    }\n\n    function handleUserLeave(data) {\n        const messageElement = (0,_helpers_dom_helpers__WEBPACK_IMPORTED_MODULE_3__.createSystemMessageElement)(`${data.username} left the room`);\n        scrollerInner.insertAdjacentHTML(\"beforeend\", messageElement.outerHTML);\n        (0,_helpers_dom_helpers__WEBPACK_IMPORTED_MODULE_3__.onlineUsersSelectorRemove)(onlineUsersSelector, data.username);\n        (0,_common_chat_utils__WEBPACK_IMPORTED_MODULE_0__.scrollDown)(chatFeedInner);\n    }\n}\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/room/roomPage.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./ZenChat/src/js/main.js");
/******/ 	
/******/ })()
;