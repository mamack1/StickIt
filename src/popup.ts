document.addEventListener("DOMContentLoaded", () => {
	chrome.storage.session.get("popupShown", (result: { [key: string]: any }) => {
		if (result.popupShown) {
			// If the popup has been shown, redirect immediately
			window.location.href = "dashboard.html";
		} else {
			const numberOfNotes = 10; // Adjust the number of notes as needed
			const splashBot = document.getElementById("sp_bot") as HTMLElement | null;
			const body = document.body;

			for (let i = 0; i < numberOfNotes; i++) {
				const note = document.createElement("div");
				note.className = "note";
				note.style.backgroundColor = getRandomColor();
				document.body.appendChild(note);

				// Randomize starting horizontal position
				const randomX = Math.random() * 90; // Full width
				note.style.left = `${randomX}%`;

				// Add random delay and duration for each note
				note.style.animationDelay = `${Math.random() * 4}s`;
				note.style.animationDuration = `${3}s`; // Duration set to 3s
			}

			if (splashBot) {
				splashBot.addEventListener("animationend", () => {
					body.classList.add("fade-out");
					setTimeout(() => {
						window.location.href = "dashboard.html";
					}, 1000); // 1-second delay
				});
			}

			// Mark the popup as shown in this session
			chrome.storage.session.set({ popupShown: true });
		}
	});
});

function getRandomColor(): string {
	const colors: string[] = [
		"#FFFF00",
		"#00EFFF",
		"#FF00CC",
		"#FF4E4E",
		"#FFA05A",
		"#FFF2D4",
	];
	return colors[Math.floor(Math.random() * colors.length)];
}
