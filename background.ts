chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({ notes: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "saveNote") {
		chrome.storage.local.get("notes", (result) => {
			const notes = result.notes || [];
			const updatedNotes = notes.filter(
				(note: any) => note.id !== request.note.id
			);
			updatedNotes.push(request.note);
			chrome.storage.local.set({ notes: updatedNotes }, () => {
				sendResponse({ status: "success" });
			});
		});
		return true;
	}
});
