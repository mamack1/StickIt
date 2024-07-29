"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const createNoteButton = document.getElementById("createNote");
    if (createNoteButton) {
        createNoteButton.addEventListener("click", () => {
            chrome.runtime.sendMessage({ action: "createNote" });
        });
    }
    else {
        console.error("Create Note button not found");
    }
});
