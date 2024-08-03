console.log("note.ts script loaded");

// Listens for message sent from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "createNote") {
		console.log("createNote message received in content script");

		// Calls function to create note
		createNewNote();

		// Respond back to the background script
		sendResponse({ success: true });

		// Return true to background script
		return true;
	}
});

interface Note {
	id: string;
	color: string;
	position: { top: number; left: number };
	innerhtml: string;
}

// Generate a unique ID for the note
//TODO: Prevent potential duplicates
function generateUniqueId(): string {
	return Math.random().toString(36).substr(2, 9);
}

// Create and display the note
function createNewNote() {
	console.log("Creating new note");

	const id = generateUniqueId();
	const noteData: Note = {
		id,
		color: "yellow",
		position: { top: 100, left: 100 },
		innerhtml: `
            <div class="note" style="background-color: yellow; position: absolute; top: 100px; left: 100px;">
                <textarea class="note-content" rows="4" cols="20">This is a note</textarea>
                <button class="close-note">X</button>
            </div>
        `,
	};

	const noteElement = createNoteElement(noteData);
	document.body.appendChild(noteElement);
	console.log("note element added to body");
}

// Create HTML element for the note
function createNoteElement(noteData: Note): HTMLElement {
	const noteContainer = document.createElement("div");
	noteContainer.innerHTML = noteData.innerhtml.trim();

	const noteElement = noteContainer.firstChild as HTMLElement;
	noteElement.style.backgroundColor = noteData.color;
	noteElement.style.top = `${noteData.position.top}px`;
	noteElement.style.left = `${noteData.position.left}px`;

	makeDraggable(noteElement);
	setupTextArea(noteElement, noteData);
	setupCloseButton(noteElement);

	return noteElement;
}

// Set up textarea to update note content
function setupTextArea(noteElement: HTMLElement, noteData: Note) {
	const textarea = noteElement.querySelector(
		".note-content"
	) as HTMLTextAreaElement;
	if (textarea) {
		textarea.addEventListener("input", () => {
			noteData.innerhtml = `
                <div class="note" style="background-color: ${noteData.color}; position: absolute; top: ${noteData.position.top}px; left: ${noteData.position.left}px;">
                    <textarea class="note-content" rows="4" cols="20">${textarea.value}</textarea>
                    <button class="close-note">X</button>
                </div>
            `;
		});
	}
}

// Set up the close button for the note
function setupCloseButton(noteElement: HTMLElement) {
	const closeButton = noteElement.querySelector(".close-note");
	if (closeButton) {
		closeButton.addEventListener("click", () => {
			document.body.removeChild(noteElement);
		});
	}
}

// Make the note draggable
function makeDraggable(element: HTMLElement) {
	let offsetX: number, offsetY: number;
	let isDragging = false;

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

//! This bypasses the service worker to make the note in the extension window, use for testing and creating note element
document.addEventListener("DOMContentLoaded", () => {
	const createNote = document.getElementById("createNote");
	if (createNote) {
		createNote.addEventListener("click", () => {
			console.log("note function called in popupMM.ts!");
			createNewNote();
		});
	}
});
