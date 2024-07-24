// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	if (message.action === "createNote") {
// 		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// 			if (tabs[0]?.id) {
// 				chrome.scripting.executeScript({
// 					target: { tabId: tabs[0].id },
// 					files: ["js/note.js"],
// 				});
// 			} else {
// 				console.error("No active tab found");
// 			}
// 		});
// 	}
// });
