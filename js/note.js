"use strict";
//draggable
function makeDraggable(element) {
    let offsetX, offsetY, isDragging = false;
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
//create a new note
function createNewNote() {
    console.log("createNewNote function called!");
    const note = document.createElement("div");
    note.className = "note";
    note.innerHTML = `
        <textarea class="note-content" placeholder="Type your note here!" rows="4" cols="20"></textarea>
        <button class="close-note">X</button>
    `;
    document.body.appendChild(note);
    // Enable dragging
    makeDraggable(note);
    const closeButton = note.querySelector(".close-note");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            document.body.removeChild(note);
        });
    }
    else {
        console.error("Close button not found");
    }
    console.log("Note window opened");
}
//button click listener
function setupButtonListener() {
    const createNoteButton = document.getElementById("createNote");
    if (createNoteButton) {
        createNoteButton.addEventListener("click", () => {
            createNewNote();
        });
    }
    else {
        console.error("Create Note button not found");
    }
}
// Initialize content script
document.addEventListener("DOMContentLoaded", setupButtonListener);
