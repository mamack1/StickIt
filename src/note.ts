interface Note {
	id: string;
	color: string;
	position: { top: number; left: number };
	innerhtml: string;
}

//nique ID for note
function generateUniqueId(): string {
	return Math.random().toString(36).substr(2, 9);
}

// Create note and display
function createNewNote() {
	console.log("Creating new note");
	const id = generateUniqueId();
	const noteData: Note = {
		id: id,
		color: "yellow",
		position: { top: 100, left: 100 },
		innerhtml: `<div class="note" style="background-color: yellow; top: 100px; left: 100px;">
                        <textarea class="note-content" rows="4" cols="20">This is a note</textarea>
                        <button class="close-note">X</button>
                    </div>`,
	};

	const noteElement = createNoteElement(noteData);
	document.body.appendChild(noteElement);
}

//HTML element for the note
function createNoteElement(noteData: Note): HTMLElement {
	const noteContainer = document.createElement("div");
	noteContainer.innerHTML = noteData.innerhtml;

	const noteElement = noteContainer.firstChild as HTMLElement;
	noteElement.style.backgroundColor = noteData.color;
	noteElement.style.top = `${noteData.position.top}px`;
	noteElement.style.left = `${noteData.position.left}px`;

	makeDraggable(noteElement);

	setupTextArea(noteElement, noteData);
	setupCloseButton(noteElement);

	return noteElement;
}

// Set up text area to update note content
function setupTextArea(noteElement: HTMLElement, noteData: Note) {
	const textarea = noteElement.querySelector(
		".note-content"
	) as HTMLTextAreaElement;
	if (textarea) {
		textarea.addEventListener("input", () => {
			noteData.innerhtml = `<div class="note" style="background-color: ${noteData.color}; top: ${noteData.position.top}px; left: ${noteData.position.left}px;">
                                    <textarea class="note-content" rows="4" cols="20">${textarea.value}</textarea>
                                    <button class="close-note">X</button>
                                </div>`;
		});
	}
}

// Set up close button
function setupCloseButton(noteElement: HTMLElement) {
	const closeButton = noteElement.querySelector(".close-note");
	if (closeButton) {
		closeButton.addEventListener("click", () => {
			document.body.removeChild(noteElement);
		});
	}
}

//TODO: make only top draggable
// Make note draggable
function makeDraggable(element: HTMLElement) {
	let offsetX: number,
		offsetY: number,
		isDragging: boolean = false;

	element.addEventListener("mousedown", (event) => {
		offsetX = event.clientX - element.getBoundingClientRect().left;
		offsetY = event.clientY - element.getBoundingClientRect().top;
		isDragging = true;
		element.style.cursor = "grabbing";
	});

	document.addEventListener("mousemove", (event) => {
		if (isDragging) {
			element.style.left = `${event.clientX - offsetX}px`;
			element.style.top = `${event.clientY - offsetY}px`;
		}
	});

	document.addEventListener("mouseup", () => {
		isDragging = false;
		element.style.cursor = "grab";
	});
}

// Initialize content script
document.addEventListener("DOMContentLoaded", () => {
	const createNoteButton = document.getElementById("createNote");
	if (createNoteButton) {
		createNoteButton.addEventListener("click", () => {
			createNewNote();
		});
	} else {
		console.error("Create Note button not found");
	}
});
