const getTabId = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0].id;
};

const injectDiv = async () => {
  const tabId = await getTabId();
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["contentScript.js"],
  });
};

document.getElementById("enable").addEventListener("click", () => injectDiv());
