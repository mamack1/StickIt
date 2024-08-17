"use strict";

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

function createNewNote(noteData) {
  const noteElement = createNoteElement(noteData);
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

  const noteContent = document.createElement("div");
  noteContent.innerHTML = noteData.innerhtml.trim();
  noteContent.style.padding = "10px";

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
  textarea.style.width = "100%";
  textarea.style.height = "100px";
  textarea.style.backgroundColor = noteData.color;
  textarea.style.border = "none";
  textarea.style.resize = "none";
  textarea.style.outline = "none";
  textarea.style.color = "black";

  const closeButton = noteContent.querySelector(".close-note");
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "5px";
  closeButton.style.backgroundColor = "#f12a2a";
  closeButton.style.color = "black";
  closeButton.style.border = "none";
  closeButton.style.borderRadius = "50%";
  closeButton.style.width = "20px";
  closeButton.style.height = "20px";
  closeButton.style.cursor = "pointer";

  noteHost.appendChild(noteContent);
  injectNoteStyles(); // No need to pass shadowRoot as we are not using it
  document.body.appendChild(noteHost);
  setupCloseButton(noteHost);
  makeDraggable(handle, noteHost);

  return noteHost;
}

function injectNoteStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .note {
        position: absolute;
        width: 150px;
        height: 150px;
        background-color: #fdfd96;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        padding: 30px;
        z-index: 1000;
        margin: 0px;
    }

    .note-content {
        width: 100%;
        height: 100%;
        resize: none;
        border: none;
        outline: none;
        background-color: transparent;
    }
        .close-note{
    text-align: center;
    padding: 0px;
    margin: 0px;
    font-size:12px;
}
  `;
  document.head.appendChild(style);
}

function setupCloseButton(noteHost) {
  const closeButton = noteHost.querySelector(".close-note");
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
      const newX = event.clientX - offsetX;
      const newY = event.clientY - offsetY;
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
                <textarea class="note-content" placeholder="New Note!!!!" ></textarea>
                <button class="close-note">X</button>
            </div>
        `,
  };
  noteData.className = "dashStickSquare";
  createNewNote(noteData);

  // Inject the toolbar if it's not already injected
  if (!document.getElementById("toolbar")) {
    injectToolbar();
  }
}

function injectToolbar() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.id = "toolbar";

  toolbar.innerHTML = `
    <button id="iconOne">
        <img src="../imgs/Move.png" alt="icon" />
    </button>
    <button id="iconTwo">
        <img src="../imgs/text.png" alt="icon" />
    </button>
    <button id="iconThree">
        <img src="../imgs/eraser.png" alt="icon" />
    </button>
    <button id="iconFour">
        <div alt="circle"></div>
    </button>
    <input type="color" id="colorPicker" style="display: none;" />
    <button id="iconFive">
        <img src="../imgs/undo.png" alt="icon" />
    </button>
    <button id="iconSix">
        <img src="../imgs/redo.png" alt="icon" />
    </button>
    <button id="iconSeven">
        <img src="../imgs/saveic.png" alt="icon" />
    </button>
  `;

  // Append the toolbar to the body
  document.body.appendChild(toolbar);

  // Inject the CSS styles into the document head
  injectToolbarStyles();

  // Log a message to confirm the toolbar was created
  console.log("Toolbar created and injected!");

  // Attach the event listeners for the toolbar buttons
  setupToolbarEventListeners();
}

function injectToolbarStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .toolbar {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      position: absolute;
      z-index: 21000 !important;
      background-color: var(--toolbarBg, #ffffff); /* Fallback color */
      height: 340px;
      width: 50px;
      border-radius: 15px;
      filter: drop-shadow(0 0 0.4rem black);
      row-gap: 20px;
      justify-content: center;
      align-items: center;
      padding: 10px;
      top: 0;
      left: 0;
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
      align-self: center;
    }

    #iconSix {
      width: 25px;
      height: 25px;
      align-self: center;
    }

    #iconSeven {
      width: 20px;
      height: 30px;
      align-self: center;
    }
  `;
  document.head.appendChild(style);
}

function setupToolbarEventListeners() {
  // Add event listeners for toolbar buttons here
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createNote") {
    handleCreateNoteRequest(request.color);
    console.log("NOTE INJECTED");
    sendResponse({ success: true });
    return true;
  }
});
