// testContent.ts
console.log("note.ts script loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Message received in content script:", message);

	if (message.action === "testMessage") {
		console.log("testMessage received in content script");

		// Call a function to verify that it runs
		createTest();

		// Respond back to the background script
		sendResponse({ success: true });

		// Return true to indicate that the response is asynchronous
		return true;
	}
});

function createTest() {
	return console.log("Creating a new note");
}
