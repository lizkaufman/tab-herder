const groupTabsButton = document.querySelector("#groupTabsButton");

groupTabsButton.addEventListener("click", async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });

  const ungroupedTabInfo = tabs.map((tab) => {
    const baseUrlMatch = tab.url.match(/https:\/\/([\w\d.]*)\//);

    if (baseUrlMatch === null) {
      return { id: tab.id, baseUrl: null };
    }

    return { id: tab.id, baseUrl: baseUrlMatch[1] };
  });

  const groupedTabIds = ungroupedTabInfo
    .reduce(
      (acc, cur) => {
        if (cur.baseUrl === null) {
          return { ...acc, 0: [...acc["0"], cur.id] };
        }

        if (Object.keys(acc).includes(cur.baseUrl)) {
          return { ...acc, [cur.baseUrl]: [...acc[cur.baseUrl], cur.id] };
        }

        return { ...acc, [cur.baseUrl]: [cur.id] };
      },
      { 0: [] }
    )
    .sort();
  console.log(groupedTabIds);
});

// Tab object keys: active,audible,autoDiscardable,discarded,favIconUrl,groupId,height,highlighted,id,incognito,index,mutedInfo,pinned,selected,status,title,url,width,windowId
