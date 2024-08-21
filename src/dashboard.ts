// DOMContentLoaded Event listener establishes note buttons in order to retrieve color of the note selected, then current url and proceeds to send the createNote message including those two parameters
document.addEventListener("DOMContentLoaded", () => {
	const noteParent = document.getElementById("noteParent");

	if (noteParent) {
		function handleClick(event: MouseEvent) {
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
		}

		// Eventlistener removed and added in order to prevent the eventlistener from stacking, which caused multiple note creations on click
		noteParent.removeEventListener("click", handleClick);

		noteParent.addEventListener("click", handleClick);
	} else {
		console.error("Parent container not found");
	}
});
