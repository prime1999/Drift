import { connectToBackend, onBackendMessage, sendToBackend } from "./websocket";

import { getTabs } from "./tools/getTabs";
import { groupTabs } from "./tools/groupTabs";

onBackendMessage(async (message) => {
  if (!message || typeof message !== "object") {
    return;
  }

  const data = message as {
    type?: string;
    id?: string;
    tool?: string;
    args?: {
      tabIds?: number[];
      groupName?: string;
    };
  };

  if (data.type !== "tool_request") {
    return;
  }

  // -------------------------
  // GET TABS
  // -------------------------

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

    return;
  }

  // -------------------------
  // GROUP TABS
  // -------------------------

  if (data.tool === "group_tabs") {
    try {
      const tabIds = data.args?.tabIds;
      const groupName = data.args?.groupName;

      if (!tabIds || !Array.isArray(tabIds)) {
        throw new Error("tabIds must be an array");
      }

      if (!groupName || typeof groupName !== "string") {
        throw new Error("groupName is required");
      }

      const result = await groupTabs(tabIds, groupName);

      sendToBackend({
        type: "tool_result",
        id: data.id,
        success: true,
        result,
      });
    } catch (error) {
      sendToBackend({
        type: "tool_result",
        id: data.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return;
  }
});

connectToBackend();
