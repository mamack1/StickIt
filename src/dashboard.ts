// Global variable to store the click event handler reference
let clickEventListener: ((event: MouseEvent) => void) | null = null;

// DOMContentLoaded Event listener establishes note buttons in order to retrieve color of the note selected,
// then current url and proceeds to send the createNote message including those two parameters
document.addEventListener("DOMContentLoaded", () => {
	const noteParent = document.getElementById("noteParent");

	if (noteParent) {
		// Remove any existing event listener to prevent duplication
		if (clickEventListener) {
			noteParent.removeEventListener("click", clickEventListener);
			clickEventListener = null; // Reset the reference to avoid multiple bindings
		}

		// Define the click handler function
		clickEventListener = (event: MouseEvent) => {
			const target = event.target as HTMLElement;

			if (target.matches(".createNoteBtn")) {
				const button = target as HTMLElement;
				const square = button.parentElement;
				const color = square?.getAttribute("noteColor") || "#FFFFFF";

				chrome.runtime.sendMessage(
					{ action: "getCurrentTabUrl" },
					(response) => {
						if (response.success) {
							const currentUrl = response.url;

							chrome.runtime.sendMessage(
								{ action: "createNote", color: color, url: currentUrl },
								(response) => {
									if (response.success) {
										console.log("Event listener triggered!!!");
										console.log("Note created successfully.");
									} else {
										console.error("Error creating note:", response.error);
									}
								}
							);
						} else {
							console.error("Error getting current tab URL:", response.error);
						}
					}
				);
			}
		};

		// Add the event listener again, ensuring it's only added once
		noteParent.addEventListener("click", clickEventListener);
	} else {
		console.error("Parent container not found");
	}
});
