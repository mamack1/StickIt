"use strict";
/*
installation
startup
idle
shutdown
*/
// //TODO: Make ability for multiple instances
// //TODO: Clean Up Console Logs
function getInjectionState(tabId) {
    return new Promise((resolve, reject) => {
        chrome.storage.session.get([`scriptInjected_${tabId}`], (result) => {
            if (chrome.runtime.lastError) {
                console.error("Error retrieving from storage:", chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            }
            else {
                resolve(!!result[`scriptInjected_${tabId}`]);
            }
        });
    });
}
function setInjectionState(tabId, state) {
    return new Promise((resolve, reject) => {
        chrome.storage.session.set({ [`scriptInjected_${tabId}`]: state }, () => {
            if (chrome.runtime.lastError) {
                console.error("Error saving to storage:", chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            }
            else {
                resolve();
            }
        });
    });
}
function removeInjectionState(tabId) {
    return new Promise((resolve, reject) => {
        chrome.storage.session.remove([`scriptInjected_${tabId}`], () => {
            if (chrome.runtime.lastError) {
                console.error("Error removing from storage:", chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            }
            else {
                resolve();
            }
        });
    });
}
function checkAndInjectScript(tabId, request) {
    getInjectionState(tabId)
        .then((isInjected) => {
        if (isInjected) {
            console.log(`Script already injected for tab ${tabId}. Skipping injection.`);
            chrome.tabs.sendMessage(tabId, request, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to tab:", chrome.runtime.lastError);
                }
                else {
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
            return setInjectionState(tabId, true);
        })
            .then(() => {
            chrome.tabs.sendMessage(tabId, request, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to tab:", chrome.runtime.lastError);
                }
                else {
                    console.log("Response from content script:", response);
                }
            });
        })
            .catch((error) => {
            console.error(`Error injecting script into tab ${tabId}:`, error);
        });
    })
        .catch((error) => {
        console.error("Error getting injection state:", error);
    });
}
chrome.runtime.onSuspend.addListener(() => {
    console.log("Service worker is being suspended. Clearing script injection state.");
    chrome.storage.session.clear(() => {
        if (chrome.runtime.lastError) {
            console.error("Error clearing storage:", chrome.runtime.lastError);
        }
        else {
            console.log("Storage cleared.");
        }
    });
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "createNote") {
        chrome.tabs
            .query({ active: true, currentWindow: true })
            .then((tabs) => {
            if (tabs && tabs.length > 0 && typeof tabs[0].id === "number") {
                const tabId = tabs[0].id;
                if (tabId !== undefined) {
                    chrome.tabs.get(tabId, (tab) => {
                        if (chrome.runtime.lastError) {
                            console.error("Error getting tab details:", chrome.runtime.lastError);
                            sendResponse({
                                success: false,
                                error: "Failed to get tab details",
                            });
                            return;
                        }
                        const noteRequest = Object.assign(Object.assign({}, request), { url: tab.url });
                        checkAndInjectScript(tabId, noteRequest);
                        sendResponse({ success: true });
                    });
                    return true;
                }
                else {
                    console.error("No active tab found");
                    sendResponse({ success: false, error: "No active tab found" });
                }
            }
            else {
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
    if (request.action === "getCurrentTabUrl") {
        chrome.tabs
            .query({ active: true, currentWindow: true })
            .then((tabs) => {
            if (tabs && tabs.length > 0 && typeof tabs[0].url === "string") {
                sendResponse({ success: true, url: tabs[0].url });
            }
            else {
                sendResponse({ success: false, error: "No URL found" });
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
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        // Inject the note content script
        chrome.scripting.executeScript({
            target: { tabId },
            files: ["js/injectNoteScript.js"],
        }, () => {
            // Retrieve notes after the script is injected
            chrome.tabs.sendMessage(tabId, { action: "retrieveNote" }, () => {
                // Remove the injection state after notes are retrieved
                removeInjectionState(tabId)
                    .then(() => {
                    console.log(`Injection state removed for tab ${tabId}`);
                })
                    .catch((error) => {
                    console.error(`Error removing injection state for tab ${tabId}:`, error);
                });
            });
        });
    }
});
chrome.action.onClicked.addListener(() => {
    console.log("Extension icon clicked, activating service worker.");
    chrome.runtime.sendMessage({ action: "keepAlive" });
});
