document.addEventListener('DOMContentLoaded', () => {
    const numberOfNotes = 10; // Adjust the number of notes as needed

    for (let i = 0; i < numberOfNotes; i++) {
        const note = document.createElement('div');
        note.className = 'note';
        note.style.backgroundColor = getRandomColor();
        document.body.appendChild(note);
        
        // Add random delay for each note
        note.style.animationDelay = `${Math.random() * 5}s`;
    }
});

function getRandomColor() {
    const colors = ['#FFFF00', '#00EFFF', '#FF00CC', '#FF4E4E', '#FFA05A', '#FFF2D4'];
    return colors[Math.floor(Math.random() * colors.length)];
}
