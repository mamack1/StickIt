"use strict";
// Event listener for creating note
//TODO: Remove unnecesarry Console logs
document.addEventListener("DOMContentLoaded", () => {
    const createNoteButton = document.getElementById("createNote");
    if (createNoteButton) {
        createNoteButton.addEventListener("click", () => {
            console.log("Create Note button clicked");
            chrome.runtime.sendMessage({ action: "createNote" }, (response) => {
                if (response && response.success) {
                    console.log("Note creation triggered successfully");
                }
                else {
                    console.error("Failed to trigger note creation:", response ? response.error : "Unknown error");
                }
            });
        });
    }
    else {
        console.error("Create Note button not found");
    }
});
