import { connectToBackend, onBackendMessage, sendToBackend } from "./websocket";
import { getTabs } from "./tools/getTabs";

onBackendMessage(async (message) => {
  if (!message || typeof message !== "object") {
    return;
  }

  const data = message as {
    type?: string;
    id?: string;
    tool?: string;
  };

  if (data.type !== "tool_request") {
    return;
  }

  if (data.tool === "get_tabs") {
    try {
      const tabs = await getTabs();

      sendToBackend({
        type: "tool_result",
        id: data.id,
        success: true,
        result: tabs,
      });
    } catch (error) {
      sendToBackend({
        type: "tool_result",
        id: data.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
});

connectToBackend();
