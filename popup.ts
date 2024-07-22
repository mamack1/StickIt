document.addEventListener("DOMContentLoaded", () => {
	const createNote = document.getElementById("create-note");

	if (createNote) {
		createNote.addEventListener("click", () => {
			chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
				const left = currentWindow.left! + (currentWindow.width! - 300);
				const top = currentWindow.top;

				chrome.windows.create({
					url: chrome.runtime.getURL("note.html"),
					type: "popup",
					width: 400,
					height: 300,
					left: left,
					top: top,
				});
				console.log("OPENED");
			});
		});
	}
});
