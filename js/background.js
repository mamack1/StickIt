"use strict";
/*
installation
startup
idle
shutdown
*/
//TODO: Make ability for multiple instances
//TODO: Clean Up Console Logs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "createNote") {
        chrome.tabs
            .query({ active: true, currentWindow: true })
            .then((tabs) => {
            console.log("Tabs queried:", tabs);
            if (tabs && tabs.length > 0 && typeof tabs[0].id === "number") {
                const tabId = tabs[0].id;
                console.log("Active tab ID:", tabId);
                chrome.scripting
                    .executeScript({
                    target: { tabId },
                    files: ["js/injectNoteScript.js"],
                })
                    .then(() => {
                    console.log("Script injected successfully");
                    chrome.tabs.sendMessage(tabId, { action: "createNote" }, (response) => {
                        if (response.success) {
                            console.log("Note created successfully");
                        }
                        else {
                            console.error("Error creating note:", response.error);
                        }
                    });
                })
                    .catch((error) => {
                    console.error("Error injecting script:", error);
                    sendResponse({ success: false, error: error.message });
                });
            }
            else {
                console.error("Error: No active tab found or invalid tab ID");
                sendResponse({
                    success: false,
                    error: "No active tab found or invalid tab ID",
                });
            }
        })
            .catch((error) => {
            console.error("Error querying tabs:", error);
            sendResponse({ success: false, error: error.message });
        });
        return true; // Keep the sendResponse valid
    }
});
