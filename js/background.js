"use strict";

// Keeps track of script injection state for tabs
const scriptInjectionState = {};

function checkAndInjectScript(tabId, request) {
  if (scriptInjectionState[tabId]) {
    console.log(
      `Script already injected for tab ${tabId}. Skipping injection.`
    );
    chrome.tabs.sendMessage(tabId, request, (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error sending message to tab:",
          chrome.runtime.lastError
        );
      } else {
        console.log("Response from content script:", response);
      }
    });
    return;
  }

  chrome.scripting
    .executeScript({
      target: { tabId: tabId },
      files: ["js/injectNoteScript.js"],
    })
    .then(() => {
      console.log(`Script injected into tab ${tabId}`);
      scriptInjectionState[tabId] = true;
      chrome.tabs.sendMessage(tabId, request, (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error sending message to tab:",
            chrome.runtime.lastError
          );
        } else {
          console.log("Response from content script:", response);
        }
      });
    })
    .catch((error) => {
      console.error(`Error injecting script into tab ${tabId}:`, error);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createNote") {
    chrome.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (tabs.length > 0 && tabs[0].id !== undefined) {
          const tabId = tabs[0].id;
          checkAndInjectScript(tabId, request);
          sendResponse({ success: true });
        } else {
          console.error("No active tab found");
          sendResponse({ success: false, error: "No active tab found" });
        }
      })
      .catch((error) => {
        console.error("Error querying tabs:", error);
        sendResponse({ success: false, error });
      });
    return true;
  }
  sendResponse({ success: false, error: "Unknown action" });
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    scriptInjectionState[tabId] = false;
    console.log(`Injection state reset for tab ${tabId}`);
  }
});

// This block is executed immediately when the background script loads
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length === 0) {
    console.error("No active tab found");
    return;
  }
  const activeTabId = tabs[0].id;
  if (activeTabId !== undefined) {
    chrome.tabs.sendMessage(
      activeTabId,
      { action: "createNote", color: color }, // Ensure `color` is defined or passed appropriately
      (response) => {
        if (response.success) {
          console.log("Note creation message sent successfully");
        } else {
          console.error("Error creating note:", response.error);
        }
      }
    );
  } else {
    console.error("Invalid tab ID");
  }
});
