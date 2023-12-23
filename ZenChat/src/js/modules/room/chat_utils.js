// Scroll to the bottom of the chat container
export function scrollDown(container) {
    if (container == null) {
        console.error("ScrollDown(): container is null.");
        return;
    }
    container.scrollTop = container.scrollHeight;
}