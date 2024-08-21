"use strict";
// This function checks the session storage to see if the content script has been injected in the web page
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
// This function sets the injection state to true
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
// This function removes the ijectionstate from the session storage
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
// Check and inject script retrieves the injection state of the current tab, if it is injected it returns, if it is not injected
// it will inject the content script into the page
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
// Event listener that calls create note functions when the createNote message is received, the tabid and the request including the current url is passed to checkandinject, which passes the message to the content script calling the function
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
    // This request action responds with the url of the current tab
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
// complete is called when the page is done loading. The content script is injected, then retrieve notes is called to display the notes matching the current url, and then the content script is removed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ["js/injectNoteScript.js"],
        }, () => {
            chrome.tabs.sendMessage(tabId, { action: "retrieveNote" }, () => {
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
// This listener was intended to re-activate the service worker, may not be necesarry
chrome.action.onClicked.addListener(() => {
    console.log("Extension icon clicked, activating service worker.");
    chrome.runtime.sendMessage({ action: "keepAlive" });
});
//popup check
// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.session.set({ popupShown: false });
});
chrome.action.onClicked.addListener(() => {
    chrome.storage.session.get("popupShown", (result) => {
        if (result.popupShown) {
            // If the popup has been shown in this session, open the dashboard directly
            chrome.tabs.create({ url: "pages/dashboard.html" });
        }
        else {
            // If the popup hasn't been shown, show the popup and set the flag
            chrome.storage.session.set({ popupShown: true });
            chrome.action.openPopup(); // Show the popup
        }
    });
});
