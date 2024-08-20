"use strict";
// On idle store notes in local, and sync
// On shutdown store notes in local, and sync
// Moved to Inject
/*function storeNote() {
    noteList.forEach((note) => {
        const noteElement = document.querySelector(
            `[data-note-id="${note.id}"]`
        ) as HTMLElement;

        if (noteElement) {
            const shadowRoot = noteElement.shadowRoot;
            const noteContent = shadowRoot?.querySelector(
                ".note-content"
            ) as HTMLTextAreaElement;

            if (noteContent) {
                note.text = noteContent.value.trim();
            }

            const noteRect = noteElement.getBoundingClientRect();
            note.position = {
                top: noteRect.top + window.scrollY,
                left: noteRect.left + window.scrollX,
            };
        }
    });

    convertNoteToJson();
}
*/
/*
// Incorporate the test triggers into scripts and buttons
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
    testNoteCreation.addEventListener("click", () =>
        handleCreateNoteRequest2("yellow")
    );
} else {
    console.error("Test Note Creation button not found");
}

// TODO: Unpack the note
// X-Y are present in the greater div
// The content is present in the textArea
// How do I access the ID

// interface Note {
// 	id: string;
// 	color: string;
// 	position: { top: number; left: number };
// 	innerhtml: string;
// 	url: string;
// }

// function generateUniqueId2(): string {
// 	return Math.random().toString(36).substr(2, 9);
// }

// function createNewNote2(noteData: Note) {
// 	const noteElement = createNoteElement2(noteData);
// 	noteElement.setAttribute("data-note-id", noteData.id);

// 	const shadowRoot = noteElement.shadowRoot;
// 	const noteContent = shadowRoot?.querySelector(
// 		".note-content"
// 	) as HTMLTextAreaElement;

// 	if (noteContent) {
// 		noteContent.value = noteData.text;
// 	}

// 	document.body.appendChild(noteElement);
// }

// function createNoteElement2(noteData: Note): HTMLElement {
// 	const noteHost = document.createElement("div");
// 	noteHost.style.position = "absolute";
// 	noteHost.style.top = `${noteData.position.top}px`;
// 	noteHost.style.left = `${noteData.position.left}px`;
// 	noteHost.style.width = "200px";
// 	noteHost.style.height = "150px";
// 	noteHost.style.zIndex = "2147483646";

// 	const shadowRoot = noteHost.attachShadow({ mode: "open" });

// 	const noteContent = document.createElement("div");
// 	noteContent.innerHTML = noteData.innerhtml.trim();
// 	noteContent.style.backgroundColor = noteData.color;
// 	noteContent.style.padding = "10px";
// 	noteContent.style.borderRadius = "5px";
// 	noteContent.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";

// 	const handle = document.createElement("div");
// 	handle.style.width = "50px";
// 	handle.style.height = "5px";
// 	handle.style.marginTop = "5px";
// 	handle.style.marginBottom = "5px";
// 	handle.style.backgroundColor = "grey";
// 	handle.style.borderRadius = "10px";
// 	handle.style.position = "absolute";
// 	handle.style.top = "5px";
// 	handle.style.left = "50%";
// 	handle.style.transform = "translateX(-50%)";
// 	handle.style.cursor = "grab";
// 	handle.style.zIndex = "2147483647";

// 	noteContent.appendChild(handle);

// 	const textarea = noteContent.querySelector(
// 		".note-content"
// 	) as HTMLTextAreaElement;

// 	if (textarea) {
// 		textarea.value = noteData.text;
// 		textarea.style.width = "100%";
// 		textarea.style.height = "100px";
// 		textarea.style.backgroundColor = noteData.color;
// 		textarea.style.border = "none";
// 		textarea.style.resize = "none";
// 		textarea.style.outline = "none";
// 		textarea.style.color = "black";
// 	}

// 	const closeButton = noteContent.querySelector(
// 		".close-note"
// 	) as HTMLButtonElement;

// 	if (closeButton) {
// 		closeButton.style.position = "absolute";
// 		closeButton.style.top = "5px";
// 		closeButton.style.right = "5px";
// 		closeButton.style.backgroundColor = noteData.color;
// 		closeButton.style.color = "black";
// 		closeButton.style.border = "none";
// 		closeButton.style.borderRadius = "50%";
// 		closeButton.style.width = "20px";
// 		closeButton.style.height = "20px";
// 		closeButton.style.cursor = "pointer";
// 	}

// 	shadowRoot.appendChild(noteContent);
// 	document.body.appendChild(noteHost);

// 	setupCloseButton2(noteHost);
// 	makeDraggable2(handle, noteHost);
// 	return noteHost;
// }

// function setupCloseButton2(noteHost: HTMLElement) {
// 	const closeButton = noteHost.shadowRoot?.querySelector(
// 		".close-note"
// 	) as HTMLButtonElement;
// 	if (closeButton) {
// 		closeButton.addEventListener("click", () => {
// 			document.body.removeChild(noteHost);
// 		});
// 	}
// }


// function handleCreateNoteRequest2(color: string) {
// 	const noteData: Note = {
// 		id: generateUniqueId2(),
// 		color: color,
// 		position: { top: 100, left: 100 },
// 		innerhtml: `
//             <div class="note" style="padding: 10px;">
//                 <textarea class="note-content">Abernathy</textarea>
//                 <button class="close-note">X</button>
//             </div>
//         `,
// 		text: "NOTEEEE!",
// 		url: window.location.href,
// 	};


// }
/*
// Required for uploading notes
function convertNoteToJson() {
    const notesObject: { [key: string]: Note } = {};
    noteList.forEach((note) => {
        notesObject[note.id] = note;
    });

    chrome.storage.local.set(notesObject, () => {
        console.log("Notes have been saved:", notesObject);
    });
}

// Loop through NoteList, and pull notes that match URL
function createNoteFromStorage(result: string) {
    let note: Note = JSON.parse(result);
    console.log("running createNoteFromStorage");
    console.log(note);
    createNewNote2(note);
}

function retrieveNote() {
    console.log("RetrieveNote is running");
    chrome.storage.local.get(null, (result) => {
        const notes = Object.values(result) as Note[];
        notes.forEach((note) => {
            noteList.push(note);
            createNewNote2(note);
        });
        console.log(noteList);
    });
}

// Keep but have duplicate checking
function addNoteToArray(stringyData: string) {
    let parsedData = JSON.parse(stringyData);
    const values = Object.values(parsedData);
    values.forEach((value: any) => {
        let noteValue: Note = value;
        console.log(noteValue);
        noteList.push(noteValue);
        createNewNote2(noteValue);
    });
    console.log(noteList);
}

function clearStorage() {
    noteList.length = 0; // Clear noteList
    chrome.storage.local.clear(() => {
        console.log("All keys cleared");
    });
}

*/ 
