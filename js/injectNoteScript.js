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
  noteHost.style.height = "208px";
  noteHost.style.zIndex = "2147483646";

  // Attach shadow DOM for encapsulated styles
  const shadowRoot = noteHost.attachShadow({ mode: "open" });
  const noteContent = document.createElement("div");
  noteContent.innerHTML = noteData.innerhtml.trim();
  noteContent.style.backgroundColor = noteData.color;
  noteContent.style.borderRadius = "10px";
  noteContent.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.15)";
  noteContent.style.position = "relative";
  noteContent.style.padding = "10px";

  // Handle for dragging
  const handle = document.createElement("div");
  handle.style.width = "60px";
  handle.style.height = "6px";
  handle.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  handle.style.borderRadius = "3px";
  handle.style.position = "absolute";
  handle.style.top = "8px";
  handle.style.left = "50%";
  handle.style.transform = "translateX(-50%)";
  handle.style.cursor = "grab";
  handle.style.zIndex = "2147483647";
  noteContent.appendChild(handle);

  // Handle textarea
  const textarea = noteContent.querySelector(".note-content");
  if (textarea) {
    textarea.style.width = "100%";
    textarea.style.height = "120px";
    textarea.style.backgroundColor = noteData.color;
    textarea.style.border = "none";
    textarea.style.position = "relative";
    textarea.style.resize = "none";
    textarea.style.marginTop = "30px"; // Adjust this to leave space for the handle
    textarea.style.borderRadius = "10px";
    textarea.style.outline = "none";
    textarea.style.color = "black";
    textarea.style.padding = "10px";
    textarea.style.boxSizing = "border-box";
    textarea.addEventListener("input", () => {
      storeNote();
    });
  }

  // Handle close button
  const closeButton = noteContent.querySelector(".close-note");
  if (closeButton) {
    closeButton.style.position = "absolute";
    closeButton.style.top = "8px";
    closeButton.style.right = "8px";
    closeButton.style.backgroundColor = "#ff4d4d"; // Slightly softer red
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "50%";
    closeButton.style.width = "18px";
    closeButton.style.height = "18px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "12px";
    closeButton.style.display = "flex";
    closeButton.style.alignItems = "center";
    closeButton.style.justifyContent = "center";
  }

  shadowRoot.appendChild(noteContent);
  setupCloseButton(noteHost); // Call this to attach the close button event listener
  makeDraggable(handle, noteHost);
  return noteHost;
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
      const noteElement = createNewNote(note); // Call createNewNote, which already handles setting up the note element and close button
      setupCloseButton(noteElement); // Ensure the close button is properly set up
    });
    console.log("Notes retrieved for this page:", matchingNotes);
    console.log(noteList);
  });
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
        // Hide the toolbar if the closed note was the selected one
        if (selectedNoteId === noteId) {
          const toolbar = document.querySelector(".toolbar");
          if (toolbar) {
            toolbar.style.display = "none";
            selectedNoteId = null; // Reset the selected note ID
          }
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
// Clear notes on the current page only
function clearStorage() {
  const currentUrl = window.location.href;

  // Filter out notes that match the current page URL
  const notesToClear = noteList.filter((note) => note.url === currentUrl);

  // Confirm with the user before clearing notes
  const confirmClear = window.confirm(
    "Are you sure you want to erase all notes on this page?"
  );

  if (confirmClear) {
    notesToClear.forEach((note) => {
      const noteElement = document.querySelector(`[data-note-id="${note.id}"]`);
      if (noteElement) {
        document.body.removeChild(noteElement);
      }
    });

    // Remove notes from noteList
    noteList = noteList.filter((note) => note.url !== currentUrl);

    // Remove notes from storage
    const noteIdsToRemove = notesToClear.map((note) => note.id);
    chrome.storage.local.remove(noteIdsToRemove, () => {
      console.log("All notes for this page cleared");
    });
  } else {
    console.log("Clear action canceled by the user");
  }
}

// Inject the toolbar into the page
// Inject the toolbar into the page
function injectToolbar() {
  // Check if the toolbar already exists
  if (document.querySelector(".toolbar")) {
    console.log("Toolbar already exists. Skipping injection.");
    return; // Exit the function if the toolbar already exists
  }

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.style.position = "absolute";
  toolbar.style.display = "none";

  toolbar.innerHTML = `
    <button id="iconOne"><img src="https://lh3.googleusercontent.com/pw/AP1GczN-DpPVU7JHUW8SjuCdo7DGznZVjj7Kjefci_1Mv23meMMoU5MhT3LADKU-uxUtcpY7oEXuxgXxP5l_x30qps5BU6gT3MEqEA2X8ascxKgEH4kXJSu6E6YeRHz6Vljv-qMFOhRoczxnW8aS4j6W_Lvq9A=w28-h28-s-no-gm?authuser=0" alt="icon" /></button>
    <button id="iconTwo"><img src="https://lh3.googleusercontent.com/pw/AP1GczMsy3w6gWVwnjJRZazZig0vllcuCLZ2I7eNq855K2kZ8AF78vQQuLD08JeGPsvnm10di_9r2wr1sEs44zUATv6lJPI0cXEJB89M2BfnDooTO-1F7jDpB7ipZn4Zj8O9o6yI_mrpsHOZmkfQm6bQcan5iA=w20-h21-s-no-gm?authuser=0" alt="icon" /></button>
    <button id="iconThree"><img src="https://lh3.googleusercontent.com/pw/AP1GczPG2tQ85a5crHpW_wmfY1hYH4nlBLJghbQ0EBNCeW7NLzY4bHXCd-dfnttLkYETXT1Om9VYM2mErg5PS9z9_6nIF-y9GayZVLnf3ijgkFURGV7OW5_24XbTYVsb3TXJ7L6_gekP2wZyWc6i-oY12rA4JQ=w25-h25-s-no-gm?authuser=0" alt="icon" /></button>
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

function setupToolbarInteractions(toolbar) {
  document.addEventListener("click", (event) => {
    const note = event.target.closest(".note-host");
    const iconFour = document.getElementById("iconFour");
    const colorPicker = document.querySelector(".color-picker"); // Replace with the actual selector for the color picker

    if (note) {
      selectedNoteId = note.getAttribute("data-note-id");
      const noteRect = note.getBoundingClientRect();
      toolbar.style.top = `${noteRect.top}px`;
      toolbar.style.left = `${
        noteRect.left + window.scrollX - toolbar.offsetWidth - 10
      }px`;
      toolbar.style.display = "flex"; // Show the toolbar
      console.log(`Toolbar shown for note ID: ${selectedNoteId}`);
    } else if (iconFour.contains(event.target)) {
      // Do nothing if the click is on iconFour or the color picker
      toolbar.style.display = "flex";
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
    clearStorage(); // Call the updated clearStorage function
  });
  const iconFour = document.getElementById("iconFour");
  const colorPicker = document.getElementById("colorPicker");

  iconFour.addEventListener("click", () => {
    console.log("Circle icon clicked");

    // Make sure the colorPicker is visible
    colorPicker.style.display = "block"; // Ensure it is visible
    colorPicker.style.position = "absolute";
    colorPicker.style.borderRadius = "50%";
    colorPicker.style.width = "30px";
    colorPicker.style.height = "30px";

    colorPicker.click();
  });

  // Change the circle's background color when the color is picked
  colorPicker.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    console.log("Color picked:", selectedColor); // For debugging

    if (selectedNoteId) {
      // Find the note with the selectedNoteId
      const noteElement = document.querySelector(
        `[data-note-id="${selectedNoteId}"]`
      );
      if (noteElement) {
        const shadowRoot = noteElement.shadowRoot;
        const noteContent = shadowRoot?.querySelector(".note-content");
        if (noteContent) {
          noteContent.style.backgroundColor = selectedColor; // Apply the color to the note's inner content
        }

        // Update the note data in the noteList
        const note = noteList.find((n) => n.id === selectedNoteId);
        if (note) {
          note.color = selectedColor; // Update the color in noteList
          storeNote(); // Save the changes
        }
      }
    }

    colorPicker.style.display = "none"; // Hide it again after selecting color
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
injectToolbar();

// Retrieve notes when the page loads
retrieveNote();
