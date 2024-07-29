console.log("note.js script loaded");

//Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "createNote") {
		console.log("createNote message received in content script");
		createNewNote();
	}
});

//Note interface
interface Note {
	id: string;
	color: string;
	position: { top: number; left: number };
	innerhtml: string;
}

//ID for note
function generateUniqueId(): string {
	return Math.random().toString(36).substr(2, 9);
}

//Create and display note
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
	console.log("Note element added to body");
}

//HTML element for the note
function createNoteElement(noteData: Note): HTMLElement {
	const noteContainer = document.createElement("div");
	noteContainer.innerHTML = noteData.innerhtml;

	const noteElement = noteContainer.firstChild as HTMLElement;
	if (noteElement) {
		noteElement.style.backgroundColor = noteData.color;
		noteElement.style.top = `${noteData.position.top}px`;
		noteElement.style.left = `${noteData.position.left}px`;

		makeDraggable(noteElement);
		setupTextArea(noteElement, noteData);
		setupCloseButton(noteElement);
	} else {
		console.error("Failed to create note element");
	}

	return noteElement;
}

//textarea to update note
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
			console.log("Note content updated");
		});
	} else {
		console.error("Textarea not found in note element");
	}
}

//close button for note
function setupCloseButton(noteElement: HTMLElement) {
	const closeButton = noteElement.querySelector(".close-note");
	if (closeButton) {
		closeButton.addEventListener("click", () => {
			document.body.removeChild(noteElement);
			console.log("Note removed from body");
		});
	} else {
		console.error("Close button not found in note element");
	}
}

//note draggable
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
