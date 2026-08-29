export async function getTabs() {
  const tabs = await chrome.tabs.query({});

  return tabs.map((tab) => ({
    id: tab.id,
    title: tab.title,
    url: tab.url,
    active: tab.active,
    windowId: tab.windowId,
  }));
}
