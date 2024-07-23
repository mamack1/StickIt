document.addEventListener('DOMContentLoaded', () => {
    const numberOfNotes = 10; // Adjust the number of notes as needed

    for (let i = 0; i < numberOfNotes; i++) {
        const note = document.createElement('div');
        note.className = 'note';
        note.style.backgroundColor = getRandomColor();
        document.body.appendChild(note);
        
        // Randomize starting horizontal position
        const randomX = Math.random() * 100; // Full width
        note.style.left = `${randomX}%`;
     
        
        // Add random delay and duration for each note
        note.style.animationDelay = `${Math.random() * 5}s`;
        note.style.animationDuration = `${Math.random() * 15 + 5}s`; // Duration between 5s and 10s
    }
});

function getRandomColor() {
    const colors = ['#FFFF00', '#00EFFF', '#FF00CC', '#FF4E4E', '#FFA05A', '#FFF2D4'];
    return colors[Math.floor(Math.random() * colors.length)];
}
