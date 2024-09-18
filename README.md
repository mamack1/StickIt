# StickIt - Chrome Extension (Private Project)

<img src="https://github.com/JacksonBair/StickIt/blob/Khay-Dev/imgs/icon.png?raw=true" width="250">

**StickIt** is a Chrome extension developed as part of our capstone project for the TechWise software engineering program. The extension offers a seamless, in-browser sticky note system to help users take notes and organize information while browsing the web.

This project is currently private, but this README serves to provide a clear understanding of its goals, features, and implementation for potential employers and recruiters.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation (for Review)](#installation-for-review)
5. [Usage](#usage)
6. [Development Process](#development-process)
7. [Screenshots](#screenshots)
8. [Future Plans](#future-plans)
9. [License](#license)
10. [Contact](#contact)

---

## Overview

### About StickIt

**StickIt** is a Chrome extension designed to help users quickly jot down thoughts, tasks, or important web elements through sticky notes directly in the browser. It integrates easily into the user’s browsing flow and ensures notes persist across sessions through local storage.

This project showcases front-end development skills, particularly in creating user-friendly browser extensions, and the ability to work with APIs, browser events, and storage mechanisms.

---

## Features

StickIt provides users with the following functionalities:

- **Create, Edit, and Delete Sticky Notes**: Users can create sticky notes from the extension popup, edit and modify them, and delete them when no longer needed.
- **Persistent Notes**: Notes persist across browser sessions, saved locally in the browser’s storage, ensuring that users don’t lose their notes.
- **Customizable UI**: Sticky notes are draggable and users can modify the note color, offering a personalized experience for arranging them within the browser window.
- **Lightweight and Non-intrusive**: Designed to be minimal, StickIt doesn’t interfere with other browser functionality or websites.

---

## Technologies Used

StickIt is built using the following technologies and tools:

- **HTML/CSS/TypeScript**: Core technologies for creating the UI and functionality of the extension.
- **Chrome Extensions API**: To handle browser events and manage the local storage of notes.
- **LocalStorage API**: For persistent storage of notes across sessions.
- **ShadowDOM API**: Used for preventing the web page styling from interferin with the notes.

---

## Installation (for Review)

As the repository is currently private, installation for direct review requires manual setup:

1. **Clone the Repository**:

   - Contact me for repository access and clone it locally.
     ```bash
     git clone https://github.com/mamack1/stickit.git
     ```

2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer Mode** in the upper-right corner.
   - Click on **Load unpacked** and select the directory where the StickIt repository is stored.
3. The StickIt extension will now be available in your browser toolbar.

---

## Usage

### Creating and Managing Notes

- **Create a new note**: Click the StickIt icon in the browser toolbar to open the extension and click one of the six colored aquares to create a new note of that color.
- **Edit a note**: Click on any existing note to modify its content. Utilize the toolbar to change the color of the note.
- **Delete a note**: Click the "X" button on any sticky note to remove the individual or utilize the toolbar to delete all notes from the page.
- **Rearrange notes**: Drag the top of the note anywhere on a web page to reposition.

### Persistent Storage

All notes are stored locally in the browser's storage, ensuring they persist even after closing and reopening the browser. Note content, color, and position are dynamically updated when interacting with them.

---

## Development Process

The development process focused on building a robust, user-friendly tool while balancing simplicity and functionality:

1. **Planning**: We began by outlining the main features and use cases for StickIt. The primary goals were ease of use, seamless integration with the browser, and a clean UI.

2. **UI/UX Design**: Using minimalist design principles, we built a user interface that is easy to navigate and non-intrusive.

3. **Implementation**:

   - Developed using TypeScript compiled into JavaScript, ensuring compatibility and lightweight performance.
   - Integrated Chrome's Extensions API for handling browser interactions and used LocalStorage for persistent note-saving.

4. **Testing**: Conducted manual testing across different environments to ensure the extension works consistently across various websites and browser sessions.

---

## Screenshots

<!-- Add screenshots here. -->

![StickIt UI](path/to/screenshot1.png)
_Example of a sticky note in the browser._

![Note Management](path/to/screenshot2.png)
_Editing and deleting a sticky note._

---

## Future Plans

Once the StickIt Chrome extension reaches full functionality and stability, I plan to:

- **Open-source the project**: Invite community contributions to expand features and improve user experience.
- **Implement additional customization**: Options for color themes and note formatting (e.g., bold, italics).
- **Sync across devices**: Allow users to sync notes across devices using cloud-based storage (e.g., Chrome Sync).
- **Deploy on Chrome Web Store**: Make StickIt available to the public through the Chrome Web Store.

---

## License

Currently, StickIt is a private project and is not yet licensed for public distribution. Upon open-sourcing, the project will be released under the [MIT License](LICENSE).

---

## Contact

For inquiries regarding this project, please feel free to reach out:

- ![Mike Headshot](path/to/mikePhoto.png)

## Michael Mack - Full Stack

- **Email**: mkemack@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/michael-a-mack/
- **GitHub**: https://github.com/mamack1
