// Bakcground service worker for testing
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.action === "testMessage") {
		console.log("Message received at background.ts");

		try {
			console.log("Querying active tab...");
			const tabs = await new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					if (chrome.runtime.lastError) {
						console.error("Error querying tabs:", chrome.runtime.lastError);
						reject(chrome.runtime.lastError);
					} else {
						console.log("Tabs queried:", tabs);
						resolve(tabs);
					}
				});
			});

			const tabId = tabs[0]?.id;
			console.log("Active tab ID:", tabId);

			if (typeof tabId === "number") {
				console.log("Injecting content script...");
				chrome.scripting.executeScript(
					{
						target: { tabId },
						files: ["js/note.js"],
					},
					() => {
						console.log("Content script injected successfully");

						console.log("Sending test message to content script...");
						chrome.tabs.sendMessage(
							tabId,
							{ action: "testMessage" },
							(response) => {
								if (chrome.runtime.lastError) {
									console.error(
										"Error sending message to content script:",
										chrome.runtime.lastError
									);
								} else {
									console.log("Message sent to content script:", response);
									console.log("Response from content script:", response);
								}
							}
						);
					}
				);
			} else {
				console.error("No active tab found or tabId is not a number");
			}
		} catch (error) {
			console.error("Error in try block:", error);
		}
	}
});

// Bakcground service worker for creating new note
// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
// 	if (message.action === "createNote") {
// 		console.log("Message received at background.ts");

// 		try {
// 			// Query for the active tab
// 			console.log("Querying active tab...");
// 			const tabs = await new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
// 				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// 					if (chrome.runtime.lastError) {
// 						console.error("Error querying tabs:", chrome.runtime.lastError);
// 						reject(chrome.runtime.lastError);
// 					} else {
// 						console.log("Tabs queried:", tabs);
// 						resolve(tabs);
// 					}
// 				});
// 			});

// 			const tabId = tabs[0]?.id;
// 			console.log("Active tab ID:", tabId);

// 			if (typeof tabId === "number") {
// 				// Execute the script in the active tab
// 				console.log("Executing script in tab ID:", tabId);
// 				await new Promise<void>((resolve, reject) => {
// 					chrome.scripting.executeScript(
// 						{
// 							target: { tabId },
// 							files: ["js/note.js"], // Ensure the path is correct
// 						},
// 						() => {
// 							if (chrome.runtime.lastError) {
// 								console.error(
// 									"Error executing script:",
// 									chrome.runtime.lastError.message
// 								);
// 								reject(new Error(chrome.runtime.lastError.message));
// 							} else {
// 								console.log("Script executed successfully");
// 								resolve();
// 							}
// 						}
// 					);
// 				});

// 				// Send a message to the content script to create a note and await response
// 				console.log("Sending message to content script to create a note...");
// 				const response = await new Promise((resolve, reject) => {
// 					chrome.tabs.sendMessage(
// 						tabId,
// 						{ action: "createNote" },
// 						(response) => {
// 							if (chrome.runtime.lastError) {
// 								console.error(
// 									"Error sending message to content script:",
// 									chrome.runtime.lastError
// 								);
// 								reject(new Error(chrome.runtime.lastError.message));
// 							} else {
// 								console.log("Message sent to content script:", response);
// 								resolve(response);
// 							}
// 						}
// 					);
// 				});
// 				console.log("Response from content script:", response);
// 			} else {
// 				console.error("No active tab found or tabId is not a number");
// 			}
// 		} catch (error) {
// 			console.error("Error in try block:", error);
// 		}
// 	}

// 	// Return true to indicate that the response is asynchronous
// 	return true;
// });
