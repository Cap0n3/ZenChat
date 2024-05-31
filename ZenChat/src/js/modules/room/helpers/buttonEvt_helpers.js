export function addEventListenersToButtons(element) {
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

        // Store the nonce in the button's dataset for later use
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
    const nonce = event.currentTarget.dataset.nonce;
    console.log("Respond message with nonce: " + nonce);
}
