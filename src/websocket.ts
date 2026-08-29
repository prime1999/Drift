//TODO: replace with the actual backend URL when deploying to production
const WS_URL = "ws://localhost:3001";

let socket: WebSocket | null = null;

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
    console.log("Backend:", event.data);
  });

  socket.addEventListener("close", () => {
    console.log("Disconnected from Drift backend");
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
}
