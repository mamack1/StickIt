//TODO: Remove unnecessary Console Logs
//TODO: Clean Up
console.log("injectNoteScript.ts loaded");

//TODO: track url location?
interface Note {
	id: string;
	color: string;
	position: { top: number; left: number };
	innerhtml: string;
}

//TODO: fix possible matching ids
// Function to generate a unique ID for the note
function generateUniqueId(): string {
	return Math.random().toString(36).substr(2, 9);
}

// Function to create and display the note
function createNewNote(noteData: Note) {
	const noteElement = createNoteElement(noteData);
	document.body.appendChild(noteElement);
}

// Function to create HTML element for the note
function createNoteElement(noteData: Note): HTMLElement {
	const noteContainer = document.createElement("div");
	noteContainer.innerHTML = noteData.innerhtml.trim();

	const noteElement = noteContainer.firstChild as HTMLElement;
	noteElement.style.backgroundColor = noteData.color;
	noteElement.style.top = `${noteData.position.top}px`;
	noteElement.style.left = `${noteData.position.left}px`;

	makeDraggable(noteElement);
	setupCloseButton(noteElement);

	return noteElement;
}

// Function to set up the close button for the note
function setupCloseButton(noteElement: HTMLElement) {
	const closeButton = noteElement.querySelector(
		".close-note"
	) as HTMLButtonElement;
	if (closeButton) {
		closeButton.addEventListener("click", () => {
			document.body.removeChild(noteElement);
		});
	}
}

// Function to make the note draggable
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

// This function will be called by the background script when requested
function handleCreateNoteRequest() {
	const noteData: Note = {
		id: generateUniqueId(),
		color: "yellow",
		position: { top: 100, left: 100 },
		innerhtml: `
            <div class="note" style="background-color: yellow; position: absolute; top: 100px; left: 100px; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);">
                <textarea class="note-content" style="width: 100%; height: 100px; background-color: yellow; border: none; resize: none; outline: none; color: black;">New Note!!!!</textarea>
                <button class="close-note" style="position: absolute; top: 5px; right: 5px; background-color: yellow; color: black; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">X</button>
            </div>
        `,
	};

	createNewNote(noteData);
}

// Listen for createNote messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "createNote") {
		handleCreateNoteRequest();
		sendResponse({ success: true });
		return true;
	}
});
