document.addEventListener("DOMContentLoaded", () => {
	const toggleButton = document.getElementById("edit_btn");
	const editImage = "../imgs/edit.png"; // Path to the edit image
	const otherImage = "../imgs/editActive.png"; // Path to the other image
	const squares = document.querySelectorAll(".dashStickSquare");
	const toolbar = document.querySelector(".toolbar");

	toolbar.style.display = "none";

	// Array of colors
	const colors = [
		"#ed622f", // Orange
		"#33FF57", // Green
		"#486bf7", // Blue
		"#b35cf2", // Purple
		"#f25ce1", // Pink
		"#33FFF5", // Light Blue
		"#f5e342", // Yellow
		"#31ebbf", // Turquoise
		"#f71414", // Red
		"#b8b6b6", // Grey
		"#358253", // Forest
	];

	toggleButton.addEventListener("click", () => {
		const img = toggleButton.querySelector("img");
		const activeEdit = img.src.includes("editActive.png");

		img.src = img.src.includes("edit.png") ? otherImage : editImage;

		toolbar.style.display = activeEdit ? "none" : "flex";
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
