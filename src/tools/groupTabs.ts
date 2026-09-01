export async function groupTabs(tabIds: number[], groupName: string) {
  if (tabIds.length === 0) {
    throw new Error("Cannot create a tab group with no tabs");
  }

  const groupTabIds: [number, ...number[]] = [tabIds[0], ...tabIds.slice(1)];

  const groupId = await chrome.tabs.group({
    tabIds: groupTabIds,
  });

  await chrome.tabGroups.update(groupId, {
    title: groupName,
  });

  return {
    groupId,
    tabIds,
    groupName,
  };
}
