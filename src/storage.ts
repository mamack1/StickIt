const noteList = new Array<Note>();
// On idle store notes in local, and sync
// On shutdown store notes in local, and sync

function storeNote() {
	// for(let note of noteList) {
	// 	for(let item in Object.entries(note)) {
	// 		console.log(`${item}: ${(note as {[key: string]: string})[item]}`);
	// 	}
	// }
}

const storeNoteButton = document.getElementById("storeNote");

if (storeNoteButton) {
	storeNoteButton.addEventListener("click", storeNote);
} else {
	console.error("Store Note button not found");
}

const getNoteButton = document.getElementById("getNote");

if (getNoteButton) {
	getNoteButton.addEventListener("click", retrieveNote);
} else {
	console.error("Get Note button not found");
}

const clearStorageButton = document.getElementById("clearStorage");

if (clearStorageButton) {
	clearStorageButton.addEventListener("click", clearStorage);
} else {
	console.error("Clear Storage button not found");
}

const testNoteCreation = document.getElementById("testNoteCreation");
if (testNoteCreation) {
	testNoteCreation.addEventListener("click", handleCreateNoteRequest2);
} else {
	console.error("Test Note Creation button not found");
}

// TODO: Unpack the note
// X-Y are present in the greater div
// The content is present in the textArea
// How do I access the ID

interface Note {
	id: string;
	color: string;
	position: { top: number; left: number };
	innerhtml: string;
	url: string;
}

function generateUniqueId2(): string {
	return Math.random().toString(36).substr(2, 9);
}

// Function to create and display the note
function createNewNote2(noteData: Note) {
	const noteElement = createNoteElement2(noteData);
	document.body.appendChild(noteElement);
}

// Function to create HTML element for the note
function createNoteElement2(noteData: Note): HTMLElement {
	const noteContainer = document.createElement("div");
	noteContainer.innerHTML = noteData.innerhtml.trim();

	const noteElement = noteContainer.firstChild as HTMLElement;
	noteElement.style.backgroundColor = noteData.color;
	noteElement.style.top = `${noteData.position.top}px`;
	noteElement.style.left = `${noteData.position.left}px`;

	makeDraggable2(noteElement);
	setupCloseButton2(noteElement);

	return noteElement;
}

// Function to set up the close button for the note
function setupCloseButton2(noteElement: HTMLElement) {
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
function makeDraggable2(element: HTMLElement) {
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
function handleCreateNoteRequest2() {
	const noteData: Note = {
		id: generateUniqueId2(),
		color: "yellow",
		position: { top: 100, left: 100 },
		innerhtml: `
            <div class="note" style="background-color: yellow; position: absolute; top: 100px; left: 100px; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);">
                <textarea class="note-content" style="width: 100%; height: 100px; background-color: yellow; border: none; resize: none; outline: none; color: black;">New Note!!!!</textarea>
                <button class="close-note" style="position: absolute; top: 5px; right: 5px; background-color: yellow; color: black; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">X</button>
            </div>
        `,
		url: window.location.href,
	};

	createNewNote2(noteData);
	// TODO: Stringigying the note for stoage testing
	noteList.push(noteData);
	// console.log(noteList);
	convertNoteToJson();
}

function convertNoteToJson() {
	for (let i = 0; i < noteList.length; i++) {
		let note = noteList[i];
		let jsonString = JSON.stringify(note);
		chrome.storage.local.set({ [note.id]: note });
		console.log(jsonString);
	}
}

function createNoteFromStorage(result: string) {
	let note: Note = JSON.parse(result);
	console.log("running createNoteFromStorage");
	console.log(note);
	createNewNote2(note);
}

function retrieveNote() {
	console.log("RetriveNote is running");
	chrome.storage.local.get(null).then((result) => {
		let stringyData = JSON.stringify(result);
		// console.log(stringyData);
		addNoteToArray(stringyData);
	});
}

function addNoteToArray(stringyData: string) {
	let parsedData = JSON.parse(stringyData);
	const values = Object.values(parsedData);
	values.forEach((value: any) => {
		let noteValue: Note = value
		console.log(noteValue);
		noteList.push(noteValue);
		createNewNote2(noteValue);
	});
	console.log(noteList);
}

function clearStorage() {
	for (let i = 0; i < noteList.length; i++) {
		noteList.pop();
	}
	console.log(noteList);
	chrome.storage.local.clear(() => {
		console.log("All keys cleared");
	});
}

function convertActiveNoteToObject() {}
