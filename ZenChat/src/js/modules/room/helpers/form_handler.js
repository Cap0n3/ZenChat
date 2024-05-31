export function handleFormSubmit(form, input, ws) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = input.value.trim();

        if (!message) return;

        if (message.length > 10000) {
            console.error("Message too long.");
            return;
        }

        ws.send(JSON.stringify({ "message": message }));
        input.value = "";
    });
}
