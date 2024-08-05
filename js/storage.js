"use strict";
// TODO: Figure out why the storage doesn't work
// On idle store notes in local, and sync
// On shutdown store notes in local, and sync
const value = "pog!";
const key = "pog?";
function storeNote() {
    chrome.storage.local.set({ key: value }).then(() => {
        console.log("Value = " + key + " " + value);
    });
}
function retrieveNote() {
    chrome.storage.local.get(["key"]).then((result) => {
        console.log("Value is " + result.key + " " + result.value);
    });
}
function clearStorage() {
    chrome.storage.local.clear(() => {
        console.log("All keys cleared");
    });
}
const storeNoteButton = document.getElementById("storeNote");
if (storeNoteButton) {
    storeNoteButton.addEventListener("click", storeNote);
}
else {
    console.error("Store Note button not found");
}
const getNoteButton = document.getElementById("getNote");
if (getNoteButton) {
    getNoteButton.addEventListener("click", retrieveNote);
}
else {
    console.error("Get Note button not found");
}
const clearStorageButton = document.getElementById("clearStorage");
if (clearStorageButton) {
    clearStorageButton.addEventListener("click", clearStorage);
}
else {
    console.error("Clear Storage button not found");
}
// TODO: Unpack the note
// X-Y are present in the greater div
// The content is present in the textArea
// How do I access the ID
