"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const noteButton = document.getElementById("noteButton");
    if (noteButton) {
        noteButton.addEventListener("click", () => {
            console.log("Note button clicked");
            chrome.runtime.sendMessage({ action: "createNote" }, (response) => {
                if (response.success) {
                    console.log("Note creation message sent successfully");
                }
                else {
                    console.error("Error creating note:", response.error);
                }
            });
        });
    }
});
