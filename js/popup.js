document.addEventListener('DOMContentLoaded', () => {
    const numberOfNotes = 10; // Adjust the number of notes as needed
    const splashBot = document.getElementById('sp_bot');
    const body = document.body;

    for (let i = 0; i < numberOfNotes; i++) {
        const note = document.createElement('div');
        note.className = 'note';
        note.style.backgroundColor = getRandomColor();
        document.body.appendChild(note);
        
        // Randomize starting horizontal position
        const randomX = Math.random() * 90; // Full width
        note.style.left = `${randomX}%`;
     
        
        // Add random delay and duration for each note
        note.style.animationDelay = `${Math.random() * 4}s`;
        note.style.animationDuration = `${2}s`; // Duration between 5s and 10s
    }
    splashBot.addEventListener('animationend', () => {
        body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000); // 2-second delay
    });
});

function getRandomColor() {
    const colors = ['#FFFF00', '#00EFFF', '#FF00CC', '#FF4E4E', '#FFA05A', '#FFF2D4'];
    return colors[Math.floor(Math.random() * colors.length)];
}
