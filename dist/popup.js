"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const note_1 = require("./note");
document.addEventListener("DOMContentLoaded", () => {
    const createNote = document.getElementById("createNote");
    if (createNote) {
        createNote.addEventListener("click", () => {
            (0, note_1.createNewNote)();
        });
    }
});
