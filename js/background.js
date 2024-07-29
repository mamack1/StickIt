"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (message.action === "createNote") {
        console.log("Message received at background.ts");
        try {
            // Query for the active tab
            console.log("Querying active tab...");
            const tabs = yield new Promise((resolve, reject) => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error querying tabs:", chrome.runtime.lastError);
                        reject(chrome.runtime.lastError);
                    }
                    else {
                        console.log("Tabs queried:", tabs);
                        resolve(tabs);
                    }
                });
            });
            const tabId = (_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id;
            console.log("Active tab ID:", tabId);
            if (typeof tabId === "number") {
                // Execute the script in the active tab
                console.log("Executing script in tab ID:", tabId);
                yield new Promise((resolve, reject) => {
                    chrome.scripting.executeScript({
                        target: { tabId },
                        files: ["js/note.js"], // Ensure the path is correct
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error executing script:", chrome.runtime.lastError.message);
                            reject(new Error(chrome.runtime.lastError.message));
                        }
                        else {
                            console.log("Script executed successfully");
                            resolve();
                        }
                    });
                });
            }
            else {
                console.error("No active tab found or tabId is not a number");
            }
        }
        catch (error) {
            console.error("Error in try block:", error);
        }
        // If sendResponse is needed, call it here (optional)
        // sendResponse({ success: true });
    }
}));
