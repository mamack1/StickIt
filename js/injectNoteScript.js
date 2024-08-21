"use strict";

// Declare selectedNoteId
let selectedNoteId = null;
const noteList = [];

// Generate unique ID for each note
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Create a new note and append it to the document
function createNewNote(noteData) {
  const noteElement = createNoteElement(noteData);
  noteElement.setAttribute("data-note-id", noteData.id);
  document.body.appendChild(noteElement);
}

// Create the HTML structure for a new note
function createNoteElement(noteData) {
  const noteHost = document.createElement("div");
  noteHost.className = "note-host";
  noteHost.style.position = "absolute";
  noteHost.style.top = `${noteData.position.top}px`;
  noteHost.style.left = `${noteData.position.left}px`;
  noteHost.style.width = "200px";
  noteHost.style.height = "150px";
  noteHost.style.zIndex = "2147483646";

  // Attach shadow DOM for encapsulated styles
  const shadowRoot = noteHost.attachShadow({ mode: "open" });
  const noteContent = document.createElement("div");
  noteContent.innerHTML = noteData.innerhtml.trim();
  noteContent.style.backgroundColor = noteData.color;
  noteContent.style.padding = "10px";
  noteContent.style.borderRadius = "5px";
  noteContent.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";

  // Handle for dragging
  const handle = document.createElement("div");
  handle.style.width = "50px";
  handle.style.height = "5px";
  handle.style.backgroundColor = "grey";
  handle.style.borderRadius = "10px";
  handle.style.position = "absolute";
  handle.style.top = "5px";
  handle.style.left = "50%";
  handle.style.transform = "translateX(-50%)";
  handle.style.cursor = "grab";
  handle.style.zIndex = "2147483647";
  noteContent.appendChild(handle);

  // Handle textarea
  const textarea = noteContent.querySelector(".note-content");
  if (textarea) {
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

  // Handle close button
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

// Setup functionality for the close button on a note
function setupCloseButton(noteHost) {
  const closeButton = noteHost.shadowRoot?.querySelector(".close-note");
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

// Make note draggable
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
    storeNote();
  });
}

// Handle creation of a new note
function handleCreateNoteRequest(color) {
  const noteData = {
    id: generateUniqueId(),
    color: color,
    position: { top: 100, left: 700 },
    innerhtml: `
      <div class="note" style="padding: 10px;">
        <textarea placeholder="StickIt!" class="note-content"></textarea>
        <button class="close-note">X</button>
      </div>
    `,
    url: window.location.href,
  };
  createNewNote(noteData);
  noteList.push(noteData);
  storeNote();
}

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createNote") {
    handleCreateNoteRequest(request.color);
    console.log("New Note Injected");
    sendResponse({ success: true });
    return true;
  }
});

// Store notes in local storage
function storeNote() {
  noteList.forEach((note) => {
    const noteElement = document.querySelector(`[data-note-id="${note.id}"]`);
    if (noteElement) {
      const shadowRoot = noteElement.shadowRoot;
      const noteContent = shadowRoot?.querySelector(".note-content");
      if (noteContent) {
        note.innerhtml = noteContent.outerHTML;
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

// Convert notes to JSON and save
function convertNoteToJson() {
  const notesObject = {};
  noteList.forEach((note) => {
    notesObject[note.id] = note;
  });
  chrome.storage.local.set(notesObject, () => {
    console.log("Notes have been saved:", notesObject);
  });
}

// Retrieve notes from storage
function retrieveNote() {
  console.log("RetrieveNote is running");
  chrome.storage.local.get(null, (result) => {
    const notes = Object.values(result);
    const currentUrl = window.location.href;
    const matchingNotes = notes.filter((note) => note.url === currentUrl);
    matchingNotes.forEach((note) => {
      noteList.push(note);
      createNewNote(note);
    });
    console.log("Notes retrieved for this page:", matchingNotes);
    console.log(noteList);
  });
}

// Clear all stored notes
function clearStorage() {
  noteList.forEach((note) => {
    const noteElement = document.querySelector(`[data-note-id="${note.id}"]`);
    if (noteElement) {
      document.body.removeChild(noteElement);
    }
  });
  noteList.length = 0; // Clear noteList
  chrome.storage.local.clear(() => {
    console.log("All keys cleared");
  });
}

// Inject the toolbar into the page
function injectToolbar() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.style.position = "absolute";

  toolbar.innerHTML = `
    <button id="iconOne"><img src="https://lh3.googleusercontent.com/pw/AP1GczN-DpPVU7JHUW8SjuCdo7DGznZVjj7Kjefci_1Mv23meMMoU5MhT3LADKU-uxUtcpY7oEXuxgXxP5l_x30qps5BU6gT3MEqEA2X8ascxKgEH4kXJSu6E6YeRHz6Vljv-qMFOhRoczxnW8aS4j6W_Lvq9A=w28-h28-s-no-gm?authuser=0" alt="icon" /></button>
    <button id="iconTwo"><img src="https://lh3.googleusercontent.com/pw/AP1GczMsy3w6gWVwnjJRZazZig0vllcuCLZ2I7eNq855K2kZ8AF78vQQuLD08JeGPsvnm10di_9r2wr1sEs44zUATv6lJPI0cXEJB89M2BfnDooTO-1F7jDpB7ipZn4Zj8O9o6yI_mrpsHOZmkfQm6bQcan5iA=w20-h21-s-no-gm?authuser=0" alt="icon" /></button>
    <button id="iconThree"><img src="https://lh3.googleusercontent.com/pw/AP1GczOkP35F0jlHxA9HWkJX2D4U3MIBJS8bu_t7qR6CdZ7qj71MJjj5YDQm4s_gJ8hzJxNsoMOLXkDkGUtr3wUSYoBlHcNp0rLbl6G87U1GPUgGCzEcJljf8fltocKRtRfx55UmmUsnFtFgIZz1F5yCSed0Hg=w22-h23-s-no-gm?authuser=0" alt="icon" /></button>
    <button id="iconFour">
      <div class="circle" style="width: 25px; height: 25px; background-color: #cb2b9b; border-radius: 50%;"></div>
    </button>
    <input type="color" id="colorPicker" style="display: none;" />
    <button id="iconFive"><img src="https://lh3.googleusercontent.com/pw/AP1GczP3ClMcaB8B9roVfM6isgXQbU89122IPIAkV6zqVHYL-tmXtkKRuNw71HcuBlloJ2Vos4A8YRf00BszMXatJkd586K7WGUDqDBUXYVCPX5qi0SNzW92F8NIEfyeaOv8xfnSyJxW1U24Eh5cBgrD5iGvug=w20-h19-s-no-gm?authuser=0" alt="icon" /></button>
    <button id="iconSix"><img src="https://lh3.googleusercontent.com/pw/AP1GczPyAgWHA6YU862EKjCaMnOOWN1Al0XvYgkI1dF7MHcRerJJLvRAVyg-oyTDNu5O80pZ6JRoVI4J4tOjNM2Ny8yWtdGyEJdGODDISGXFXoOAot2_DOEYtITrfY7Ow9X-TL0o5LsjGGEWuXxmiBfDqm7UFg=w20-h20-s-no-gm?authuser=0" alt="icon" /></button>
    <button id="iconSeven"><img src="https://lh3.googleusercontent.com/pw/AP1GczOXOaZPfVnrtYqqYk_GH8xxcgQmRaT1oZ7uFSUi-sOXuKeLL6VQg24rK8_HfnQLYcXPTraX9Nw3ApjpX-IHZm-7EG4xk9hKZMxyI-AALjz5adj7zNne-aVx8DkKP7xZFfgK9jA0TpTBNoN8I4TDWIoUoQ=w17-h25-s-no-gm?authuser=0" alt="icon" /></button>
  `;

  document.body.appendChild(toolbar);

  // Add the CSS styles to the document head
  const style = document.createElement("style");
  style.innerHTML = `
    .toolbar {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      position: absolute;
      left: 5px;
      z-index: 2147483647;
      background-color: #FFFFFF;
      filter: drop-shadow(0 0 0.4rem black);
      height: 340px;
      width: 50px;
      border-radius: 15px;
      row-gap: 20px;
      justify-content: center;
      align-items: center;
      padding: 10px;
      margin-top: 5%;
      transform: scale(0.85);
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

    #iconOne {
      width: 30px;
      height: 30px;
    }

    #iconTwo {
      width: 22px;
      height: 22px;
    }

    #iconThree {
      width: 30px;
      height: 32px;
    }

    #iconFour {
      width: 25px;
      height: 25px;
      background-color: #cb2b9b;
      border-radius: 50%;
      filter: drop-shadow(0 0 0.2rem black);
    }

    #iconFive {
      width: 25px;
      height: 25px;
    }

    #iconSix {
      width: 25px;
      height: 25px;
    }

    #iconSeven {
      width: 20px;
      height: 30px;
    }
  `;
  document.head.appendChild(style);

  console.log("Toolbar injected");
  setupToolbarInteractions(toolbar);
}

// Set up toolbar interactions
function setupToolbarInteractions(toolbar) {
  document.addEventListener("click", (event) => {
    const note = event.target.closest(".note-host");
    if (note) {
      selectedNoteId = note.getAttribute("data-note-id");
      const noteRect = note.getBoundingClientRect();
      toolbar.style.top = `${noteRect.top}px`;
      toolbar.style.left = `${
        noteRect.left + window.scrollX - toolbar.offsetWidth - 10
      }px`;
      toolbar.style.display = "flex"; // Show the toolbar
      console.log(`Toolbar shown for note ID: ${selectedNoteId}`);
    } else {
      toolbar.style.display = "none"; // Hide the toolbar if clicked outside
    }
  });

  toolbar.querySelector("#iconOne").addEventListener("click", () => {
    console.log("Move icon clicked");
    // Handle move icon action
  });

  toolbar.querySelector("#iconTwo").addEventListener("click", () => {
    console.log("Text icon clicked");
    // Handle text icon action
  });

  toolbar.querySelector("#iconThree").addEventListener("click", () => {
    console.log("Eraser icon clicked");
    clearStorage();
  });

  toolbar.querySelector("#iconFour").addEventListener("click", () => {
    console.log("Circle icon clicked");
    const iconFour = toolbar.querySelector("#iconFour");
    const colorPicker = toolbar.querySelector("#colorPicker");
    colorPicker.click();

    // Change the circle's background color when the color is picked
    colorPicker.addEventListener("input", (event) => {
      const selectedColor = event.target.value;
      console.log("Color picked:", selectedColor); // For debugging
      iconFour.querySelector(".circle").style.backgroundColor = selectedColor; // Apply the color
    });
  });

  toolbar.querySelector("#iconFive").addEventListener("click", () => {
    console.log("Undo icon clicked");
    // Handle undo icon action
  });

  toolbar.querySelector("#iconSix").addEventListener("click", () => {
    console.log("Redo icon clicked");
    // Handle redo icon action
  });

  toolbar.querySelector("#iconSeven").addEventListener("click", () => {
    console.log("Save icon clicked");
    // Handle save icon action
  });
}

// Initialize the toolbar
injectToolbar();

// Retrieve notes when the page loads
retrieveNote();
