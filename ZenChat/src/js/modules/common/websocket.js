export function connectWebSocket(url, handlers) {
    const ws = new WebSocket(url);
    
    ws.onopen = handlers.onOpen || (() => console.log("Connected to WebSocket."));
    ws.onmessage = handlers.onMessage || ((e) => console.log(JSON.parse(e.data)));
    ws.onerror = handlers.onError || ((err) => {
        console.error("WebSocket error: " + err.message);
        ws.close();
    });

    return ws;
}
