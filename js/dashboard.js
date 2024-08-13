"use strict";
// //TODO: Remove unnecessary console logs
document.addEventListener("DOMContentLoaded", () => {
    const noteParent = document.getElementById("noteParent");
    if (noteParent) {
        function handleClick(event) {
            console.log("EVENT LISTENER TRIGGERED!!!");
            const target = event.target;
            if (target.matches(".createNoteBtn")) {
                const button = target;
                const square = button.parentElement;
                const color = (square === null || square === void 0 ? void 0 : square.getAttribute("noteColor")) || "#FFFFFF";
                chrome.runtime.sendMessage({ action: "createNote", color: color }, (response) => {
                    if (response.success) {
                        console.log("Note creation message sent successfully");
                    }
                    else {
                        console.error("Error creating note:", response.error);
                    }
                });
            }
        }
        noteParent.removeEventListener("click", handleClick);
        noteParent.addEventListener("click", handleClick);
    }
    else {
        console.error("Parent container not found");
    }
});
