"use strict";
let selectedNoteId = null;
let noteList = [];
// TODO: fix possible matching IDs
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
    noteHost.className = "note-host";
    noteHost.style.position = "absolute";
    noteHost.style.top = `${noteData.position.top}px`;
    noteHost.style.left = `${noteData.position.left}px`;
    noteHost.style.width = "200px";
    noteHost.style.height = "150px";
    noteHost.style.zIndex = "2147483646";
    // Attaches shadow to note to protect from webpage CSS and JS influence
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
        textarea.addEventListener("input", () => {
            storeNote();
        });
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
    // Show the toolbar when a note is clicked
    noteHost.addEventListener("click", () => {
        selectedNoteId = noteData.id;
        showToolbar(noteHost);
    });
    return noteHost;
}
function setupCloseButton(noteHost) {
    var _a;
    const closeButton = (_a = noteHost.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector(".close-note");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            const noteId = noteHost.getAttribute("data-note-id");
            if (noteId) {
                // Remove the note from storage
                chrome.storage.local.remove(noteId, () => {
                    console.log(`Note id: ${noteId} removed from storage.`);
                });
                // Remove the note from the page
                document.body.removeChild(noteHost);
                // Remove the note from the noteList array
                const noteIndex = noteList.findIndex((note) => note.id === noteId);
                if (noteIndex !== -1) {
                    noteList.splice(noteIndex, 1);
                }
            }
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
            // Update the toolbar position while dragging
            if (selectedNoteId === noteHost.getAttribute("data-note-id")) {
                showToolbar(noteHost);
            }
        }
    });
    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            handle.style.cursor = "grab";
            // Update the toolbar position after dragging ends
            showToolbar(noteHost);
            storeNote();
        }
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
        text: "StickIt",
        url: new URL(window.location.href).hostname,
    };
    // Inject the toolbar before creating a new note
    injectToolbar();
    createNewNote(noteData);
    noteList.push(noteData);
    storeNote();
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "createNote") {
        handleCreateNoteRequest(request.color);
        console.log("New Note Injected");
        sendResponse({ success: true });
        return true;
    }
});
/**
 * Storage Functions below
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
    const note = JSON.parse(result);
    console.log("Running createNoteFromStorage");
    console.log(note);
    createNewNote(note);
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "retrieveNote") {
        retrieveNote();
    }
});
function retrieveNote() {
    console.log("RetrieveNote is running");
    chrome.storage.local.get(null, (result) => {
        const notes = Object.values(result);
        const currentHostname = new URL(window.location.href).hostname;
        // Inject the toolbar before interacting with notes
        injectToolbar();
        // Filter notes to only include those that match the current URL
        const matchingNotes = notes.filter((note) => note.url === currentHostname);
        matchingNotes.forEach((note) => {
            noteList.push(note);
            createNewNote(note);
        });
        console.log("Notes retrieved for this page:", matchingNotes);
        console.log(noteList);
    });
}
// Keep but have duplicate checking
function addNoteToArray(stringyData) {
    const parsedData = JSON.parse(stringyData);
    const values = Object.values(parsedData);
    values.forEach((value) => {
        const noteValue = value;
        console.log(noteValue);
        noteList.push(noteValue);
        createNewNote(noteValue);
    });
    console.log(noteList);
}
function clearStorage() {
    const currentUrl = new URL(window.location.href).hostname;
    // Filter notes to only include those that match the current URL
    const notesToClear = noteList.filter((note) => note.url === currentUrl);
    const confirmClear = window.confirm("Are you sure you want to erase all notes on this page?");
    if (confirmClear) {
        // Remove each note element from the DOM
        notesToClear.forEach((note) => {
            const noteElement = document.querySelector(`[data-note-id="${note.id}"]`);
            if (noteElement) {
                document.body.removeChild(noteElement);
                console.log(`Note with ID: ${note.id} removed from DOM.`);
            }
            else {
                console.log(`Note element with ID: ${note.id} not found in DOM.`);
            }
        });
        // Update the noteList array to exclude the cleared notes
        noteList = noteList.filter((note) => note.url !== currentUrl);
        console.log(`Updated noteList:`, noteList);
        // Remove the notes from Chrome local storage
        const noteIdsToRemove = notesToClear.map((note) => note.id);
        chrome.storage.local.remove(noteIdsToRemove, () => {
            console.log("All notes for this page cleared from storage.");
            // Store the updated noteList
            convertNoteToJson();
        });
    }
    else {
        console.log("Clear action canceled by the user");
    }
}
// Inject the toolbar into the page
function injectToolbar() {
    if (document.querySelector(".toolbar-host")) {
        console.log("Toolbar already exists. Skipping injection.");
        return;
    }
    // Create a host for the shadow DOM
    const toolbarHost = document.createElement("div");
    toolbarHost.className = "toolbar-host";
    toolbarHost.style.position = "absolute";
    toolbarHost.style.display = "none";
    toolbarHost.style.zIndex = "2147483647";
    // Attach shadow DOM to the toolbar host
    const shadowRoot = toolbarHost.attachShadow({ mode: "open" });
    // Create the toolbar inside the shadow DOM
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    toolbar.innerHTML = `
        <button id="iconOne"><img src="https://lh3.googleusercontent.com/pw/AP1GczN-DpPVU7JHUW8SjuCdo7DGznZVjj7Kjefci_1Mv23meMMoU5MhT3LADKU-uxUtcpY7oEXuxgXxP5l_x30qps5BU6gT3MEqEA2X8ascxKgEH4kXJSu6E6YeRHz6Vljv-qMFOhRoczxnW8aS4j6W_Lvq9A=w28-h28-s-no-gm?authuser=0" alt="icon" /></button>
        <button id="iconTwo"><img src="https://lh3.googleusercontent.com/pw/AP1GczMsy3w6gWVwnjJRZazZig0vllcuCLZ2I7eNq855K2kZ8AF78vQQuLD08JeGPsvnm10di_9r2wr1sEs44zUATv6lJPI0cXEJB89M2BfnDooTO-1F7jDpB7ipZn4Zj8O9o6yI_mrpsHOZmkfQm6bQcan5iA=w20-h21-s-no-gm?authuser=0" alt="icon" /></button>
        <button id="iconThree"><img src="https://lh3.googleusercontent.com/pw/AP1GczPG2tQ85a5crHpW_wmfY1hYH4nlBLJghbQ0EBNCeW7NLzY4bHXCd-dfnttLkYETXT1Om9VYM2mErg5PS9z9_6nIF-y9GayZVLnf3ijgkFURGV7OW5_24XbTYVsb3TXJ7L6_gekP2wZyWc6i-oY12rA4JQ=w25-h25-s-no-gm?authuser=0" alt="icon" /></button>
        <button id="iconFour">
            <div class="circle" style="width: 20px; height: 20px; background-color: #cb2b9b; border-radius: 50%;"></div>
        </button>
        <input type="color" id="colorPicker" style="display: none;" />
        <button id="iconFive"><img src="https://lh3.googleusercontent.com/pw/AP1GczP3ClMcaB8B9roVfM6isgXQbU89122IPIAkV6zqVHYL-tmXtkKRuNw71HcuBlloJ2Vos4A8YRf00BszMXatJkd586K7WGUDqDBUXYVCPX5qi0SNzW92F8NIEfyeaOv8xfnSyJxW1U24Eh5cBgrD5iGvug=w20-h19-s-no-gm?authuser=0" alt="icon" /></button>
        <button id="iconSix"><img src="https://lh3.googleusercontent.com/pw/AP1GczPyAgWHA6YU862EKjCaMnOOWN1Al0XvYgkI1dF7MHcRerJJLvRAVyg-oyTDNu5O80pZ6JRoVI4J4tOjNM2Ny8yWtdGyEJdGODDISGXFXoOAot2_DOEYtITrfY7Ow9X-TL0o5LsjGGEWuXxmiBfDqm7UFg=w20-h20-s-no-gm?authuser=0" alt="icon" /></button>
        <button id="iconSeven"><img src="https://lh3.googleusercontent.com/pw/AP1GczOXOaZPfVnrtYqqYk_GH8xxcgQmRaT1oZ7uFSUi-sOXuKeLL6VQg24rK8_HfnQLYcXPTraX9Nw3ApjpX-IHZm-7EG4xk9hKZMxyI-AALjz5adj7zNne-aVx8DkKP7xZFfgK9jA0TpTBNoN8I4TDWIoUoQ=w17-h25-s-no-gm?authuser=0" alt="icon" /></button>
    `;
    shadowRoot.appendChild(toolbar);
    // Apply isolated styles inside the shadow DOM
    const style = document.createElement("style");
    style.innerHTML = `
        .toolbar {
            display: flex;
            flex-direction: column;
            position: absolute;
            z-index: 2147483647;
            background-color: #FFFFFF;
            filter: drop-shadow(0 0 0.4rem black);
            height: 300px;
            width: 25px;
            border-radius: 10px;
            row-gap: 10px;
            justify-content: center;
            align-items: center;
            padding: 5px;
            transform: scale(0.85);
            margin-top: -65px;
			border-right: 50px;
        }
    
        .toolbar button {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            font: inherit;
            color: inherit;
            cursor: pointer;
            outline: none;
        }
    `;
    shadowRoot.appendChild(style);
    document.body.appendChild(toolbarHost);
    setupToolbarInteractions(toolbar);
}
function setupToolbarInteractions(toolbar) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    document.addEventListener("click", (event) => {
        var _a, _b;
        const note = event.target.closest(".note-host");
        const iconFour = (_a = toolbar.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector("#iconFour");
        const colorPicker = (_b = toolbar.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector("#colorPicker");
        if (note) {
            selectedNoteId = note.getAttribute("data-note-id");
            const noteRect = note.getBoundingClientRect();
            const toolbarHost = document.querySelector(".toolbar-host");
            toolbarHost.style.top = `${noteRect.top + window.scrollY}px`;
            toolbarHost.style.left = `${noteRect.left + window.scrollX - toolbarHost.offsetWidth - 10}px`;
            toolbarHost.style.display = "flex";
        }
        else if (iconFour.contains(event.target)) {
            toolbar.style.display = "flex";
        }
        else {
            toolbar.style.display = "none";
        }
    });
    (_a = toolbar.querySelector("#iconOne")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        console.log("Move icon clicked");
    });
    (_b = toolbar.querySelector("#iconTwo")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        console.log("Text icon clicked");
    });
    (_c = toolbar.querySelector("#iconThree")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        console.log("Eraser icon clicked");
        clearStorage();
    });
    const iconFour = (_d = toolbar.shadowRoot) === null || _d === void 0 ? void 0 : _d.querySelector("#iconFour");
    const colorPicker = (_e = toolbar.shadowRoot) === null || _e === void 0 ? void 0 : _e.querySelector("#colorPicker");
    iconFour === null || iconFour === void 0 ? void 0 : iconFour.addEventListener("click", () => {
        if (colorPicker) {
            console.log("Circle icon clicked");
            colorPicker.style.display = "block";
            colorPicker.style.position = "absolute";
            colorPicker.style.borderRadius = "50%";
            colorPicker.style.width = "30px";
            colorPicker.style.height = "30px";
            colorPicker.click();
        }
    });
    colorPicker === null || colorPicker === void 0 ? void 0 : colorPicker.addEventListener("input", (event) => {
        const selectedColor = event.target.value;
        console.log("Color picked:", selectedColor);
        if (selectedNoteId) {
            const noteElement = document.querySelector(`[data-note-id="${selectedNoteId}"]`);
            if (noteElement) {
                const shadowRoot = noteElement.shadowRoot;
                if (shadowRoot) {
                    const noteContent = shadowRoot.querySelector(".note-content");
                    if (noteContent) {
                        noteContent.style.backgroundColor = selectedColor;
                    }
                }
                const note = noteList.find((n) => n.id === selectedNoteId);
                if (note) {
                    note.color = selectedColor;
                    storeNote();
                    const noteIndex = noteList.findIndex((n) => n.id === selectedNoteId);
                    if (noteIndex !== -1) {
                        document.body.removeChild(noteElement);
                        createNewNote(noteList[noteIndex]);
                    }
                }
            }
        }
        if (colorPicker) {
            colorPicker.style.display = "none";
        }
    });
    (_f = toolbar.querySelector("#iconFive")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
        console.log("Undo icon clicked");
    });
    (_g = toolbar.querySelector("#iconSix")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", () => {
        console.log("Redo icon clicked");
    });
    (_h = toolbar.querySelector("#iconSeven")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", () => {
        console.log("Save icon clicked");
    });
}
// Function to show the toolbar next to the selected note
function showToolbar(noteHost) {
    const toolbarHost = document.querySelector(".toolbar-host");
    const noteRect = noteHost.getBoundingClientRect();
    toolbarHost.style.top = `${noteRect.top + window.scrollY}px`;
    toolbarHost.style.left = `${noteRect.left + window.scrollX - toolbarHost.offsetWidth - 10}px`;
    toolbarHost.style.display = "flex";
}
