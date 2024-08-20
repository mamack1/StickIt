"use strict";
// //TODO: fix possible matching ids
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}
function createNewNote(noteData) {
    const noteElement = createNoteElement(noteData);
    noteElement.setAttribute("data-note-id", noteData.id);
    document.body.appendChild(noteElement);
}
function createNoteElement(noteData) {
    const noteHost = document.createElement("div");
    noteHost.style.position = "absolute";
    noteHost.style.top = `${noteData.position.top}px`;
    noteHost.style.left = `${noteData.position.left}px`;
    noteHost.style.width = "200px";
    noteHost.style.height = "150px";
    noteHost.style.zIndex = "2147483646";
    const shadowRoot = noteHost.attachShadow({ mode: "open" });
    const noteContent = document.createElement("div");
    noteContent.innerHTML = noteData.innerhtml.trim();
    noteContent.style.backgroundColor = noteData.color;
    noteContent.style.padding = "10px";
    noteContent.style.borderRadius = "5px";
    noteContent.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
    const handle = document.createElement("div");
    handle.style.width = "50px";
    handle.style.height = "5px";
    handle.style.marginTop = "5px";
    handle.style.marginBottom = "5px";
    handle.style.backgroundColor = "grey";
    handle.style.borderRadius = "10px";
    handle.style.position = "absolute";
    handle.style.top = "5px";
    handle.style.left = "50%";
    handle.style.transform = "translateX(-50%)";
    handle.style.cursor = "grab";
    handle.style.zIndex = "2147483647";
    noteContent.appendChild(handle);
    const textarea = noteContent.querySelector(".note-content");
    if (textarea) {
        textarea.value = noteData.text;
        textarea.style.width = "100%";
        textarea.style.height = "100px";
        textarea.style.backgroundColor = noteData.color;
        textarea.style.border = "none";
        textarea.style.resize = "none";
        textarea.style.outline = "none";
        textarea.style.color = "black";
    }
    const closeButton = noteContent.querySelector(".close-note");
    if (closeButton) {
        closeButton.style.position = "absolute";
        closeButton.style.top = "5px";
        closeButton.style.right = "5px";
        closeButton.style.backgroundColor = noteData.color;
        closeButton.style.color = "black";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "50%";
        closeButton.style.width = "20px";
        closeButton.style.height = "20px";
        closeButton.style.cursor = "pointer";
    }
    shadowRoot.appendChild(noteContent);
    document.body.appendChild(noteHost);
    setupCloseButton(noteHost);
    makeDraggable(handle, noteHost);
    return noteHost;
}
// TODO: CLEAR FROM STORAGE WHEN CLOSED
function setupCloseButton(noteHost) {
    var _a;
    const closeButton = (_a = noteHost.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(".close-note");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            document.body.removeChild(noteHost);
        });
    }
}
function makeDraggable(handle, noteHost) {
    let offsetX, offsetY;
    let isDragging = false;
    handle.addEventListener("mousedown", (event) => {
        offsetX = event.clientX - noteHost.getBoundingClientRect().left;
        offsetY = event.clientY - noteHost.getBoundingClientRect().top;
        isDragging = true;
        handle.style.cursor = "grabbing";
    });
    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const newX = event.clientX - offsetX + window.scrollX;
            const newY = event.clientY - offsetY + window.scrollY;
            noteHost.style.left = `${newX}px`;
            noteHost.style.top = `${newY}px`;
        }
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
        handle.style.cursor = "grab";
    });
}
function handleCreateNoteRequest(color) {
    const noteData = {
        id: generateUniqueId(),
        color: color,
        position: { top: 100, left: 700 },
        innerhtml: `
            <div class="note" style="padding: 10px;">
                <textarea class="note-content"></textarea>
                <button class="close-note">X</button>
            </div>
        `,
        text: "NOTEEEE!",
        url: window.location.href,
    };
    createNewNote(noteData);
    noteList.push(noteData);
    storeNote();
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "createNote") {
        handleCreateNoteRequest(request.color);
        console.log("NOTE INJECTED");
        sendResponse({ success: true });
        return true;
    }
});
/**
Storage Functions below
*/
function storeNote() {
    noteList.forEach((note) => {
        const noteElement = document.querySelector(`[data-note-id="${note.id}"]`);
        if (noteElement) {
            const shadowRoot = noteElement.shadowRoot;
            const noteContent = shadowRoot === null || shadowRoot === void 0 ? void 0 : shadowRoot.querySelector(".note-content");
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
// Required for uploading notes
function convertNoteToJson() {
    const notesObject = {};
    noteList.forEach((note) => {
        notesObject[note.id] = note;
    });
    chrome.storage.local.set(notesObject, () => {
        console.log("Notes have been saved:", notesObject);
    });
}
// Loop through NoteList, and pull notes that match URL
function createNoteFromStorage(result) {
    let note = JSON.parse(result);
    console.log("running createNoteFromStorage");
    console.log(note);
    createNewNote(note);
}
function retrieveNote() {
    console.log("RetrieveNote is running");
    chrome.storage.local.get(null, (result) => {
        const notes = Object.values(result);
        notes.forEach((note) => {
            noteList.push(note);
            createNewNote(note);
        });
        console.log(noteList);
    });
}
// Keep but have duplicate checking
function addNoteToArray(stringyData) {
    let parsedData = JSON.parse(stringyData);
    const values = Object.values(parsedData);
    values.forEach((value) => {
        let noteValue = value;
        console.log(noteValue);
        noteList.push(noteValue);
        createNewNote(noteValue);
    });
    console.log(noteList);
}
function clearStorage() {
    noteList.length = 0; // Clear noteList
    chrome.storage.local.clear(() => {
        console.log("All keys cleared");
    });
}
const noteList = new Array();
