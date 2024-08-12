"use strict";
// On idle store notes in local, and sync
// On shutdown store notes in local, and sync
const value = "pog!";
const key = "pog?";
function storeNote() {
	chrome.storage.local.set({ key: value }).then(() => {
		console.log("Value = " + key + " " + value);
	});
}
function retrieveNote() {
	chrome.storage.local.get(["key"]).then((result) => {
		console.log("Value is " + result.key + " " + result.value);
	});
}
function clearStorage() {
	chrome.storage.local.clear(() => {
		console.log("All keys cleared");
	});
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
// TODO: Unpack the note
// X-Y are present in the greater div
// The content is present in the textArea
// How do I access the ID
function convertNoteToJson() {}

function generateUniqueId() {
	return Math.random().toString(36).substr(2, 9);
}
// Function to create and display the note
function createNewNote(noteData) {
	const noteElement = createNoteElement(noteData);
	document.body.appendChild(noteElement);
}
// Function to create HTML element for the note
function createNoteElement(noteData) {
	const noteContainer = document.createElement("div");
	noteContainer.innerHTML = noteData.innerhtml.trim();
	const noteElement = noteContainer.firstChild;
	noteElement.style.backgroundColor = noteData.color;
	noteElement.style.top = `${noteData.position.top}px`;
	noteElement.style.left = `${noteData.position.left}px`;
	makeDraggable(noteElement);
	setupCloseButton(noteElement);
	return noteElement;
}
// Function to set up the close button for the note
function setupCloseButton(noteElement) {
	const closeButton = noteElement.querySelector(".close-note");
	if (closeButton) {
		closeButton.addEventListener("click", () => {
			document.body.removeChild(noteElement);
		});
	}
}
// Function to make the note draggable
function makeDraggable(element) {
	let offsetX, offsetY;
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
	const noteData = {
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
	// TODO: Stringigying the note for stoage testing
	// noteList.push(noteData);
}
