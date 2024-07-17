interface Note {
	id: string;
	content: string;
	x: number;
	y: number;
}

function createNote(note: Note) {
	const noteElement = document.createElement("div");
	noteElement.className = "sticky-note";
	noteElement.contentEditable = "true";
	noteElement.style.left = `${note.x}px`;
	noteElement.style.top = `${note.y}px`;
	noteElement.innerText = note.content;

	noteElement.addEventListener("input", () => {
		note.content = noteElement.innerText;
		saveNoteToStorage(note);
	});

	noteElement.addEventListener("mousedown", (event) => {
		const onMouseMove = (e: MouseEvent) => {
			noteElement.style.left = `${e.pageX}px`;
			noteElement.style.top = `${e.pageY}px`;
			note.x = e.pageX;
			note.y = e.pageY;
		};

		document.addEventListener("mousemove", onMouseMove);

		document.addEventListener(
			"mouseup",
			() => {
				document.removeEventListener("mousemove", onMouseMove);
				saveNoteToStorage(note);
			},
			{ once: true }
		);
	});

	document.body.appendChild(noteElement);
}

function saveNoteToStorage(note: Note) {
	chrome.runtime.sendMessage({ action: "saveNote", note: note });
}

function loadNotes() {
	chrome.storage.local.get("notes", (result) => {
		const notes = result.notes || [];
		notes.forEach((note: Note) => {
			createNote(note);
		});
	});
}

document.addEventListener("DOMContentLoaded", loadNotes);
