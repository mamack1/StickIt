function storeNote() {
    const note = "pog";
    chrome.storage.local.set({ egg: note }).then(() => {   
        console.log("Value is set");
    });
}
function retrieveNote() {
    chrome.storage.local.get(["key"]).then((result) => {
        console.log("Value is " + result.key);
    });
    console.log("Value is retrieved");
}


const storeNoteButton = document.getElementById("storeNote");

if (storeNoteButton) {
    storeNoteButton.addEventListener("click", storeNote);
} else {
    console.error("Store Note button not found");
}