//TODO: replace with the actual backend URL when deploying to production
const WS_URL = "ws://localhost:3001";

let socket: WebSocket | null = null;

type MessageHandler = (message: unknown) => void;

let messageHandler: MessageHandler | null = null;

export function onBackendMessage(handler: MessageHandler) {
  messageHandler = handler;
}

export function connectToBackend() {
  socket = new WebSocket(WS_URL);

  socket.addEventListener("open", () => {
    console.log("Connected to Drift backend");

    socket?.send(
      JSON.stringify({
        type: "ping",
      }),
    );
  });

  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);

      console.log("Message from Drift backend:", message);

      messageHandler?.(message);
    } catch (error) {
      console.error("Invalid message from backend:", error);
    }
  });

  socket.addEventListener("close", () => {
    console.log("Disconnected from Drift backend");
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

export function sendToBackend(message: unknown) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error("WebSocket is not connected");
    return;
  }

  socket.send(JSON.stringify(message));
}
