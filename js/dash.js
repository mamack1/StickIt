// "use strict";

// document.addEventListener("DOMContentLoaded", () => {
//   const noteParent = document.getElementById("noteParent");
//   const toggleButton = document.getElementById("edit_btn");
//   const editImage = "../imgs/edit.png";
//   const otherImage = "../imgs/editActive.png";
//   const squares = document.querySelectorAll(".dashStickSquare");
//   const toolbar = document.querySelector(".toolbar");

//   // Array of colors
//   const colors = [
//     "#FF5733",
//     "#33FF57",
//     "#3357FF",
//     "#F333FF",
//     "#FF33A0",
//     "#33FFF5",
//   ];

//   function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }

//   function applyColors() {
//     const shuffledColors = shuffleArray(colors);
//     squares.forEach((square, index) => {
//       square.style.backgroundColor = shuffledColors[index];
//       square.setAttribute("noteColor", shuffledColors[index]);
//     });
//   }

//   //   function handleClick(event) {
//   //     const target = event.target;
//   //     if (target.matches(".createNoteBtn")) {
//   //       const button = target;
//   //       const square = button.parentElement;
//   //       const color = square?.getAttribute("noteColor") || "#FFFFFF";
//   //       chrome.runtime.sendMessage(
//   //         { action: "createNote", color: color },
//   //         (response) => {
//   //           if (response.success) {
//   //             console.log("Note creation message sent successfully");
//   //           } else {
//   //             console.error("Error creating note:", response.error);
//   //           }
//   //         }
//   //       );
//   //     }
//   //   }

//   // Apply colors before setting up event listeners
//   applyColors();

//   if (noteParent) {
//     noteParent.removeEventListener("click", handleClick);
//     noteParent.addEventListener("click", handleClick);
//   } else {
//     console.error("Parent container not found");
//   }

//   //   if (toggleButton) {
//   //     toolbar.style.display = "none";

//   //     toggleButton.addEventListener("click", () => {
//   //       const img = toggleButton.querySelector("img");
//   //       const activeEdit = img.src.includes("editActive.png");

//   //       img.src = img.src.includes("edit.png") ? otherImage : editImage;
//   //       toolbar.style.display = activeEdit ? "none" : "flex";
//   //     });
//   //   } else {
//   //     console.error("Toggle button not found");
//   //   }
// });
