"use strict";
// //TODO: Remove unnecessary console logs
document.addEventListener("DOMContentLoaded", () => {
  const noteParent = document.getElementById("noteParent");
  const toggleButton = document.getElementById("edit_btn");
  const editImage = "../imgs/edit.png";
  const otherImage = "../imgs/editActive.png";
  const squares = document.querySelectorAll(".dashStickSquare");
  const toolbar = document.querySelector(".toolbar");

  // Array of colors
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F333FF",
    "#FF33A0",
    "#33FFF5",
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function applyColors() {
    const shuffledColors = shuffleArray(colors);
    squares.forEach((square, index) => {
      square.style.backgroundColor = shuffledColors[index];
      square.setAttribute("noteColor", shuffledColors[index]);
    });
  }

  // Apply colors before setting up event listeners
  applyColors();

  if (noteParent) {
    function handleClick(event) {
      console.log("EVENT LISTENER TRIGGERED!!!");
      const target = event.target;
      if (target.matches(".createNoteBtn")) {
        const button = target;
        const square = button.parentElement;
        const color = (square && square.getAttribute("noteColor")) || "#fdfd96";
        chrome.runtime.sendMessage(
          { action: "createNote", color: color },
          (response) => {
            if (response.success) {
              console.log("Note creation message sent successfully");
            } else {
              console.error("Error creating note:", response.error);
            }
          }
        );
      }
    }

    noteParent.removeEventListener("click", handleClick);
    noteParent.addEventListener("click", handleClick);
  } else {
    console.error("Parent container not found");
  }
});

// Remove or move these lines if not required in the global scope
// console.log("Note color:", noteData.color);
// console.log("Note HTML:", noteData.innerhtml);
