/*
installation
startup
idle
shutdown
*/

// //TODO: Make ability for multiple instances
// //TODO: Clean Up Console Logs
const scriptInjectionState: { [tabId: number]: boolean } = {};

function checkAndInjectScript(tabId: number) {
	if (scriptInjectionState[tabId]) {
		console.log(
			`Script already injected for tab ${tabId}. Skipping injection.`
		);
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
		})
		.catch((error) => {
			console.error(`Error injecting script into tab ${tabId}:`, error);
		});
}

// Handle messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "createNote") {
		chrome.tabs
			.query({ active: true, currentWindow: true })
			.then((tabs) => {
				if (tabs && tabs.length > 0 && typeof tabs[0].id === "number") {
					const tabId = tabs[0].id;
					checkAndInjectScript(tabId);

					// Attempt to send a message to the content script
					chrome.tabs.sendMessage(tabId, request, (response) => {
						if (chrome.runtime.lastError) {
							console.error(
								"Error sending message to tab:",
								chrome.runtime.lastError
							);
							sendResponse({ success: false, error: chrome.runtime.lastError });
						} else {
							console.log("Response from content script:", response);
							sendResponse({ success: true });
						}
					});
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

// Listen for tab updates to reset injection state on reload
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
	if (changeInfo.status === "complete") {
		scriptInjectionState[tabId] = false;
		console.log(`Injection state reset for tab ${tabId}`);
	}
});
