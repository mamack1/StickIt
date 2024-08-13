document.addEventListener("DOMContentLoaded", () => {
	const toggleButton = document.getElementById("edit_btn");
	const editImage = "../imgs/edit.png"; // Path to the edit image
	const otherImage = "../imgs/editActive.png"; // Path to the other image
	const squares = document.querySelectorAll(".dashStickSquare");

	// Array of colors
	const colors = [
		"#FF5733",
		"#33FF57",
		"#3357FF",
		"#F333FF",
		"#FF33A0",
		"#33FFF5",
	];

	toggleButton.addEventListener("click", () => {
		const img = toggleButton.querySelector("img");
		img.src = img.src.includes("edit.png") ? otherImage : editImage;
	});

	// Shuffle the colors array (optional, to randomize the order)
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	// Apply colors to the squares
	function applyColors() {
		const shuffledColors = shuffleArray(colors);
		squares.forEach((square, index) => {
			square.style.backgroundColor = shuffledColors[index];
			square.setAttribute("noteColor", shuffledColors[index]);
		});
	}

	applyColors();
});
