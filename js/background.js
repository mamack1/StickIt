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
        const tryInjectScript = (retries) => {
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
                        sendResponse({ success: true });
                    })
                        .catch((error) => {
                        console.error("Error injecting script:", error);
                        sendResponse({ success: false, error: error.message });
                    });
                }
                else {
                    if (retries > 0) {
                        console.warn("Retry querying active tabs...");
                        setTimeout(() => tryInjectScript(retries - 1), 500);
                    }
                    else {
                        console.error("Error: No active tab found or invalid tab ID");
                        sendResponse({
                            success: false,
                            error: "No active tab found or invalid tab ID",
                        });
                    }
                }
            })
                .catch((error) => {
                console.error("Error querying tabs:", error);
                sendResponse({ success: false, error: error.message });
            });
        };
        tryInjectScript(3); // Retry up to 3 times
        return true; // Keep the sendResponse valid
    }
});
