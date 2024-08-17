// Function to toggle images on button click
function toggleImage(buttonId, srcOne, srcTwo) {
  // Get the button element by ID
  const button = document.getElementById(buttonId);

  // Find the image inside the button
  const img = button.querySelector("img");

  // Extract the filename from the img.src
  const currentSrc = img.src.split("/").pop();

  // Toggle the image source
  img.src = currentSrc === srcOne.split("/").pop() ? srcTwo : srcOne;
}

// Event listeners for button clicks
document.getElementById("iconOne").addEventListener("click", function () {
  toggleImage("iconOne", "../imgs/Move.png", "../imgs/MoveRed.png");
});

document.getElementById("iconTwo").addEventListener("click", function () {
  toggleImage("iconTwo", "../imgs/text.png", "../imgs/textRed.png");
});

document.getElementById("iconThree").addEventListener("click", function () {
  toggleImage("iconThree", "../imgs/eraser.png", "../imgs/eraserRed.png");
});

// Color wheel
const colorPicker = document.getElementById("colorPicker");
const iconFour = document.getElementById("iconFour");

iconFour.addEventListener("click", function () {
  colorPicker.click();
});

colorPicker.addEventListener("input", function () {
  iconFour.style.backgroundColor = colorPicker.value;
});

document.getElementById("iconFive").addEventListener("click", function () {
  toggleImage("iconFive", "../imgs/undo.png", "../imgs/undoRed.png");
});

document.getElementById("iconSix").addEventListener("click", function () {
  toggleImage("iconSix", "../imgs/redo.png", "../imgs/redoRed.png");
});

document.getElementById("iconSeven").addEventListener("click", function () {
  toggleImage("iconSeven", "../imgs/saveic.png", "../imgs/saveRed.png");
});
