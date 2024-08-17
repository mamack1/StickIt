/*
installation
startup
idle
shutdown
*/

// //TODO: Make ability for multiple instances
// //TODO: Clean Up Console Logs
const scriptInjectionState: { [tabId: number]: boolean } = {};

function checkAndInjectScript(tabId: number, request: any) {
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
				if (tabs && tabs.length > 0 && typeof tabs[0].id === "number") {
					const tabId = tabs[0].id;
					if (tabId !== undefined) {
						checkAndInjectScript(tabId, request);
						return true;
					} else {
						console.error("No active tab found");
						sendResponse({ success: false, error: "No active tab found" });
					}
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
