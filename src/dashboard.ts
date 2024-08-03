// Event listener for Test Message
document.addEventListener("DOMContentLoaded", () => {
	const createNoteButton = document.getElementById("createNote");
	if (createNoteButton) {
		createNoteButton.addEventListener("click", () => {
			// Send a test message when the button is clicked
			chrome.runtime.sendMessage({ action: "testMessage" });
		});
	} else {
		console.error("Create Note button not found");
	}
});

// Event listener for creating note
// document.addEventListener("DOMContentLoaded", () => {
// 	const createNoteButton = document.getElementById("createNote");
// 	if (createNoteButton) {
// 		createNoteButton.addEventListener("click", () => {
// 			chrome.runtime.sendMessage({ action: "createNote" });
// 		});
// 	} else {
// 		console.error("Create Note button not found");
// 	}
// });
