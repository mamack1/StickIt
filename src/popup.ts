import { createNewNote } from "./note";

document.addEventListener("DOMContentLoaded", () => {
	const createNote = document.getElementById("createNote");

	if (createNote) {
		createNote.addEventListener("click", () => {
			createNewNote();
		});
	}
});
