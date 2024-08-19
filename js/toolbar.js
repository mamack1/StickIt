// // Function to toggle images on button click
// function toggleImage(buttonId, srcOne, srcTwo) {
//   // Get the button element by ID
//   const button = document.getElementById(buttonId);

//   // Find the image inside the button
//   const img = button.querySelector("img");

//   // Extract the filename from the img.src
//   const currentSrc = img.src.split("/").pop();

//   // Toggle the image source
//   img.src = currentSrc === srcOne.split("/").pop() ? srcTwo : srcOne;
// }

// // Event listeners for button clicks
// document.getElementById("iconOne").addEventListener("click", function () {
//   toggleImage(
//     "iconOne",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/Move.png?raw=true",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/MoveRed.png?raw=true"
//   );
// });

// document.getElementById("iconTwo").addEventListener("click", function () {
//   toggleImage(
//     "iconTwo",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/text.png?raw=true",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/textRed.png?raw=true"
//   );
// });

// document.getElementById("iconThree").addEventListener("click", function () {
//   toggleImage(
//     "iconThree",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/eraser.png?raw=true",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/eraserRed.png?raw=true"
//   );
// });

// // Color wheel
// const colorPicker = document.getElementById("colorPicker");
// const iconFour = document.getElementById("iconFour");

// iconFour.addEventListener("click", function () {
//   colorPicker.click();
// });

// colorPicker.addEventListener("input", function () {
//   iconFour.style.backgroundColor = colorPicker.value;
// });

// document.getElementById("iconFive").addEventListener("click", function () {
//   toggleImage(
//     "iconFive",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/undo.png?raw=true",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/undoRed.png?raw=true"
//   );
// });

// document.getElementById("iconSix").addEventListener("click", function () {
//   toggleImage(
//     "iconSix",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/redo.png?raw=true",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/redoRed.png?raw=true"
//   );
// });

// document.getElementById("iconSeven").addEventListener("click", function () {
//   toggleImage(
//     "iconSeven",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/saveic.png?raw=true",
//     "https://github.com/JacksonBair/StickIt/blob/beta/imgs/saveRed.png?raw=true"
//   );
// });
