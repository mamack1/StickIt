chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.action === "createNote") {
		console.log("Message received at background.ts");

		try {
			// Query for the active tab
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
				// Execute the script in the active tab
				console.log("Executing script in tab ID:", tabId);
				await new Promise<void>((resolve, reject) => {
					chrome.scripting.executeScript(
						{
							target: { tabId },
							files: ["js/note.js"], // Ensure the path is correct
						},
						() => {
							if (chrome.runtime.lastError) {
								console.error(
									"Error executing script:",
									chrome.runtime.lastError.message
								);
								reject(new Error(chrome.runtime.lastError.message));
							} else {
								console.log("Script executed successfully");
								resolve();
							}
						}
					);
				});
			} else {
				console.error("No active tab found or tabId is not a number");
			}
		} catch (error) {
			console.error("Error in try block:", error);
		}

		// If sendResponse is needed, call it here (optional)
		// sendResponse({ success: true });
	}
});
