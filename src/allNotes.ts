function displayNotesSummary(): void {
	chrome.storage.local.get(null, (result) => {
		const notesContainer = document.getElementById("notesContainer");

		if (notesContainer) {
			notesContainer.innerHTML = "";

			const notes = Object.values(result) as Note[];
			const notesByUrl = notes.reduce((acc, note) => {
				acc[note.url] = (acc[note.url] || 0) + 1;
				return acc;
			}, {} as { [url: string]: number });

			for (const [url, count] of Object.entries(notesByUrl)) {
				const noteSummaryElement = document.createElement("div");
				noteSummaryElement.className = "note-summary";

				const urlElement = document.createElement("a");
				urlElement.href = `http://${url}`;
				urlElement.target = "_blank";
				urlElement.innerText = url;
				urlElement.className = "clickable-url";

				noteSummaryElement.appendChild(urlElement);

				const noteCountElement = document.createElement("span");
				noteCountElement.innerText = ` - Notes: ${count}`;
				noteSummaryElement.appendChild(noteCountElement);

				notesContainer.appendChild(noteSummaryElement);
			}

			if (Object.keys(notesByUrl).length === 0) {
				notesContainer.innerHTML = "<p>No notes found in local storage.</p>";
			}
		}
	});
}

document.addEventListener("DOMContentLoaded", displayNotesSummary);
