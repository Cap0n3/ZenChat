export function addEventListenersToButtons(element) {
    // Get message author
    const messageAuthor = element.querySelector(".chat-user").firstChild;
    // Get message content
    const messageContent = element.querySelector(".message-content");
    // Get all buttons inside element
    const buttons = element.querySelectorAll("button");

    // Add event listener to each button
    buttons.forEach(button => {
        const classes = button.classList;
        const nonce = button.getAttribute("data-nonce");

        if (classes.contains("editMessage")) {
            button.addEventListener("click", handleEdit);
        } else if (classes.contains("deleteMessage")) {
            button.addEventListener("click", handleDelete);
        } else if (classes.contains("respondMessage")) {
            button.addEventListener("click", handleRespond);
        } else {
            console.error("Button class not found, check your code.");
        }

        // Store important data in button dataset for action handling
        button.dataset.author = messageAuthor.textContent;
        button.dataset.messageContent = messageContent.textContent;
        button.dataset.nonce = nonce;
    });
}

export function removeEventListenersFromButtons(element) {
    // Get all buttons inside element
    const buttons = element.querySelectorAll("button");

    // Remove event listener from each button
    buttons.forEach(button => {
        const classes = button.classList;

        if (classes.contains("editMessage")) {
            button.removeEventListener("click", handleEdit);
        } else if (classes.contains("deleteMessage")) {
            button.removeEventListener("click", handleDelete);
        } else if (classes.contains("respondMessage")) {
            button.removeEventListener("click", handleRespond);
        } else {
            console.error("Button class not found for removal, check your code.");
        }
    });
}

export function handleEdit(event) {
    const nonce = event.currentTarget.dataset.nonce;
    console.log("Edit message with nonce: " + nonce);
}

export function handleDelete(event) {
    const nonce = event.currentTarget.dataset.nonce;
    console.log("Delete message with nonce: " + nonce);
}

export function handleRespond(event) {
    const author = event.currentTarget.dataset.author;
    const message = event.currentTarget.dataset.messageContent;
    const nonce = event.currentTarget.dataset.nonce;
    const replyInput = document.getElementById("reply-input");
    const hiddenReplyNonce = document.getElementById("reply-nonce");
    replyInput.classList.replace("d-none", "d-block");
    // scroll to replyInput
    replyInput.scrollIntoView({behavior: "smooth"});
    replyInput.value = `↩️ Reply to ${author}: ${message}`;
    hiddenReplyNonce.value = nonce;
    console.log(`Respond to message from ${author}: ${message} with nonce: ${nonce}`);
}
