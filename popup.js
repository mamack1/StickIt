"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const createNote = document.getElementById("create-note");
    if (createNote) {
        createNote.addEventListener("click", () => {
            chrome.windows.create({
                url: chrome.runtime.getURL("floating.html"),
                type: "popup",
                width: 400,
                height: 300,
                left: 10,
                top: 10,
            });
            console.log("OPENED");
        });
    }
});
