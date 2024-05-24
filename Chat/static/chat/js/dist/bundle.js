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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_home_serverPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/home/serverPage */ \"./ZenChat/src/js/modules/home/serverPage.js\");\n/* harmony import */ var _modules_room_roomPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/room/roomPage */ \"./ZenChat/src/js/modules/room/roomPage.js\");\n/* harmony import */ var _modules_room_chat_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/room/chat_utils */ \"./ZenChat/src/js/modules/room/chat_utils.js\");\n\n\n\n\nfunction initialize() {\n    console.log(\"Sanity check from main.js.\");\n    const currentPage = window.location.pathname;\n    \n    if(currentPage.match(/^\\/server\\/\\d+\\/$/)) {\n        (0,_modules_home_serverPage__WEBPACK_IMPORTED_MODULE_0__.serverPage)(currentPage);\n    }\n    else if(currentPage.match(/^\\/server\\/\\d+\\/\\w+\\/$/)) {\n        console.log(\"Room page.\");\n        (0,_modules_room_roomPage__WEBPACK_IMPORTED_MODULE_1__.roomPage)();\n        (0,_modules_room_chat_utils__WEBPACK_IMPORTED_MODULE_2__.scrollDown)(document.querySelector(\"#chatFeed\"));\n    }\n    else {\n        console.log(\"Page not found.\");\n    }\n}\n\nwindow.onload = initialize;\n\n//# sourceURL=webpack:///./ZenChat/src/js/main.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/home/serverPage.js":
/*!***************************************************!*\
  !*** ./ZenChat/src/js/modules/home/serverPage.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   serverPage: () => (/* binding */ serverPage)\n/* harmony export */ });\nfunction serverPage(currentURL) {\n    console.log(\"Sanity check from homePage().\");\n\n    // focus 'roomInput' when user opens the page\n    document.querySelector(\"#roomInput\").focus();\n    \n    // submit if the user presses the enter key\n    document.querySelector(\"#roomInput\").onkeyup = function(e) {\n        if (e.keyCode === 13) {  // enter key\n            document.querySelector(\"#roomConnect\").click();\n        }\n    };\n    \n    // redirect to '/room/<roomInput>/'\n    document.querySelector(\"#roomConnect\").onclick = function() {\n        let roomName = document.querySelector(\"#roomInput\").value;\n        window.location.pathname = currentURL + roomName + \"/\";\n    }\n    \n    // redirect to '/room/<roomSelect>/'\n    document.querySelector(\"#roomSelect\").onchange = function() {\n        let roomName = document.querySelector(\"#roomSelect\").value.split(\" (\")[0];\n        window.location.pathname = currentURL + roomName + \"/\";\n    }    \n}\n\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/home/serverPage.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/room/chat_utils.js":
/*!***************************************************!*\
  !*** ./ZenChat/src/js/modules/room/chat_utils.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   scrollDown: () => (/* binding */ scrollDown)\n/* harmony export */ });\n// Scroll to the bottom of the chat container\nfunction scrollDown(container) {\n    if (container == null) {\n        console.error(\"ScrollDown(): container is null.\");\n        return;\n    }\n    container.scrollTop = container.scrollHeight;\n}\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/room/chat_utils.js?");

/***/ }),

/***/ "./ZenChat/src/js/modules/room/roomPage.js":
/*!*************************************************!*\
  !*** ./ZenChat/src/js/modules/room/roomPage.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   roomPage: () => (/* binding */ roomPage)\n/* harmony export */ });\n/* harmony import */ var _chat_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chat_utils */ \"./ZenChat/src/js/modules/room/chat_utils.js\");\n\n\nfunction roomPage() {\n    console.log(\"Sanity check from roomPage().\");\n    \n    let ws = null;\n    const roomName = JSON.parse(document.getElementById('roomName').textContent);\n    const chatFeedInner = document.getElementById(\"chatFeed\");\n    const scrollerInner = document.getElementById(\"scroller-inner\");\n    const chatMessageInput = document.getElementById(\"chatMessageInput\");\n    const onlineUsersSelector = document.getElementById(\"onlineUsersSelector\");\n    chatMessageInput.focus();\n\n    const form = document.getElementById(\"chatInputForm\");\n\n    form.addEventListener(\"submit\", handleSubmit);\n\n\n    // Handle form submission\n    function handleSubmit(e) {\n        e.preventDefault();\n        \n        const message = chatMessageInput.value.trim();\n\n        if (!message) return;\n\n        // Check for exessive message length\n        if (message.length > 10000) {\n            console.error(\"Message too long.\");\n            return;\n        }\n\n        // Send message via WebSocket\n        ws.send(JSON.stringify({\n            \"message\": message\n        }));\n        \n        // Clear input field\n        chatMessageInput.value = \"\";\n    }\n\n    \n    //===============================//\n    //=== Websocket communication ===//\n    //===============================//\n\n    function connect() {\n        ws = new WebSocket(\"ws://\" + window.location.host + \"/ws/chat/\" + roomName + \"/\");\n        ws.onopen = () => {\n            console.log(\"Connected to WebSocket.\");\n        };\n        ws.onmessage = (e) => {\n            const data = JSON.parse(e.data);\n            console.log(data);\n    \n            switch (data.type) {\n                case \"chat_message\":\n                    handleChatMessage(data);\n                    break;\n                case \"user_list\":\n                    handleUserList(data);\n                    break;\n                case \"user_join\":\n                    handleUserJoin(data);\n                    break;\n                case \"user_leave\":\n                    handleUserLeave(data);\n                    break;\n                case \"private_message\":\n                    // TODO: handle private message\n                    //handlePrivateMessage(data);\n                    break;\n                case \"private_message_delivered\":\n                    // TODO: handle private message delivery\n                    // handle private message delivery\n                    break;\n                default:\n                    console.error(\"Unknown message type: \" + data.type);\n                    break;\n            }\n        };\n        ws.onerror = (err) => {\n            console.error(\"WebSocket error: \" + err.message);\n            console.error(\"Closing socket.\");\n            ws.close();\n        };\n    }\n    \n    //==================================//\n    //=== Websocket message handlers ===//\n    //==================================//\n\n    function handleChatMessage(data) {\n        const messageElement = createMessageElement(data);\n        scrollerInner.insertAdjacentHTML(\"beforeend\", messageElement);\n        (0,_chat_utils__WEBPACK_IMPORTED_MODULE_0__.scrollDown)(chatFeedInner);\n    }\n\n    function handleUserList(data) {\n        // Set storage session with curent user list\n        sessionStorage.setItem(\"user-id\", JSON.stringify(data.current_user_id));\n        \n        for (let i = 0; i < data.users.length; i++) {\n            onlineUsersSelectorAdd(data.users[i]);\n        }\n    }\n\n    function handleUserJoin(data) {\n        const messageElement = document.createElement(\"li\");\n        messageElement.classList.add(\"message-container\");\n\n        const joinedUserElement = document.createElement(\"div\");\n        joinedUserElement.classList.add(\"chat-joined-user\");\n        joinedUserElement.textContent = `--- ${data.username} joined the room ---`;\n        messageElement.appendChild(joinedUserElement);\n\n        scrollerInner.insertAdjacentHTML(\"beforeend\", messageElement.outerHTML);\n        onlineUsersSelectorAdd(data.username);\n        (0,_chat_utils__WEBPACK_IMPORTED_MODULE_0__.scrollDown)(chatFeedInner);\n    }\n\n    function handleUserLeave(data) {\n        const messageElement = document.createElement(\"li\");\n        messageElement.classList.add(\"message-container\");\n\n        const leftUserElement = document.createElement(\"div\");\n        leftUserElement.classList.add(\"chat-joined-user\");\n        leftUserElement.textContent = `--- ${data.username} left the room ---`;\n        messageElement.appendChild(leftUserElement);\n\n        scrollerInner.insertAdjacentHTML(\"beforeend\", messageElement.outerHTML);\n        onlineUsersSelectorRemove(data.username);\n        (0,_chat_utils__WEBPACK_IMPORTED_MODULE_0__.scrollDown)(chatFeedInner);\n    }\n\n\n    // adds a new option to 'onlineUsersSelector'\n    function onlineUsersSelectorAdd(value) {\n        if (document.querySelector(\"option[value='\" + value + \"']\")) return;\n        let newOption = document.createElement(\"option\");\n        newOption.value = value;\n        newOption.innerHTML = value;\n        onlineUsersSelector.appendChild(newOption);\n    }\n\n    // removes an option from 'onlineUsersSelector'\n    function onlineUsersSelectorRemove(value) {\n        let oldOption = document.querySelector(\"option[value='\" + value + \"']\");\n        if (oldOption !== null) oldOption.remove();\n    }\n\n\n    /**\n     * Creates a new message element.\n     * @param {Object} data - The message data. \n     * @returns {string} The message element as a string.\n     * \n     * * // HTML returned by this function:\n     * // <li id=\"msg_123\" class=\"message-container\" data-user-id=\"23\">\n     * //   <img src=\"avatar.jpg\" alt=\"avatar\" class=\"user-avatar\" width=\"50\" height=\"50\">\n     * //   <h3 class=\"chat-user\">John Doe <span class=\"timestamp\">2022-01-01 12:00:00</span></h3>\n     * //   <div class=\"message-content\">Hello, world!</div>\n     * //   <div class=\"toolbar btn-group\">\n     * //     <button class=\"btn btn-outline-dark\" type=\"button\" id=\"editMessage\" data-nonce=\"123\">\n     * //       <i class=\"bi bi-pencil-fill\"></i>\n     * //     </button>\n     * //     <button class=\"btn btn-outline-dark\" type=\"button\" id=\"respondMessage\" data-nonce=\"123\">\n     * //       <i class=\"bi bi-arrow-90deg-left\"></i>\n     * //     </button>\n     * //     <button class=\"btn btn-outline-dark\" type=\"button\" id=\"deleteMessage\" data-nonce=\"123\">\n     * //       <i class=\"bi bi-trash-fill\"></i>\n     * //     </button>\n     * //   </div>\n     * // </li>\n     * \n     */\n    function createMessageElement(data) {\n        // Get current user id from session storage\n        const currentUserId = JSON.parse(sessionStorage.getItem(\"user-id\"));\n\n        // Create message container\n        const messageElement = document.createElement(\"li\");\n        messageElement.id = data.nonce;\n        messageElement.classList.add(\"message-container\");\n        messageElement.setAttribute(\"data-user-id\", data.user_id);\n    \n        // Add user avatar\n        const avatarElement = document.createElement(\"img\");\n        avatarElement.src = data.avatar;\n        avatarElement.alt = \"avatar\";\n        avatarElement.classList.add(\"user-avatar\");\n        avatarElement.width = 50;\n        avatarElement.height = 50;\n        messageElement.appendChild(avatarElement);\n    \n        // Add username title and timestamp\n        const userInfoElement = document.createElement(\"h3\");\n        userInfoElement.classList.add(\"chat-user\");\n        userInfoElement.textContent = data.username + \" \";\n        const timestampElement = document.createElement(\"span\");\n        timestampElement.classList.add(\"timestamp\");\n        timestampElement.textContent = data.timestamp;\n        userInfoElement.appendChild(timestampElement);\n        messageElement.appendChild(userInfoElement);\n    \n        // Add message content\n        const messageContentElement = document.createElement(\"div\");\n        messageContentElement.classList.add(\"message-content\");\n        messageContentElement.textContent = data.message;\n        messageElement.appendChild(messageContentElement);\n\n        // Add toolbar\n        const toolbarElement = document.createElement(\"div\");\n        toolbarElement.classList.add(\"toolbar\", \"btn-group\");\n\n        // if the message is from the current user, add edit and delete buttons\n        if (data.user_id === currentUserId) {\n            console.log(\"Message from current user.\");\n        \n            const editButton = document.createElement(\"button\");\n            editButton.classList.add(\"btn\", \"btn-outline-dark\");\n            editButton.type = \"button\";\n            editButton.id = \"editMessage\";\n            editButton.setAttribute(\"data-nonce\", data.nonce);\n            editButton.innerHTML = '<i class=\"bi bi-pencil-fill\"></i>';\n            toolbarElement.appendChild(editButton);\n\n            const deleteButton = document.createElement(\"button\");\n            deleteButton.classList.add(\"btn\", \"btn-outline-dark\");\n            deleteButton.type = \"button\";\n            deleteButton.id = \"deleteMessage\";\n            deleteButton.setAttribute(\"data-nonce\", data.nonce);\n            deleteButton.innerHTML = '<i class=\"bi bi-trash-fill\"></i>';\n            toolbarElement.appendChild(deleteButton);\n        }\n        \n        const respondButton = document.createElement(\"button\");\n        respondButton.classList.add(\"btn\", \"btn-outline-dark\");\n        respondButton.type = \"button\";\n        respondButton.id = \"respondMessage\";\n        respondButton.setAttribute(\"data-nonce\", data.nonce);\n        respondButton.innerHTML = '<i class=\"bi bi-arrow-90deg-left\"></i>';\n        toolbarElement.appendChild(respondButton);\n\n        messageElement.appendChild(toolbarElement);\n    \n        return messageElement.outerHTML;\n    }\n\n    // TODO: implement private messaging\n    // onlineUsersSelector.onchange = function() {\n    //     chatMessageInput.value = \"/pm \" + onlineUsersSelector.value + \" \";\n    //     onlineUsersSelector.value = null;\n    //     chatMessageInput.focus();\n    // }\n\n    connect();\n}\n\n//# sourceURL=webpack:///./ZenChat/src/js/modules/room/roomPage.js?");

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