# StickIt - Chrome Extension

<img src="public/icons/icon.png" width="250">

**StickIt** is a Chrome extension developed as part of the TechWise software engineering capstone project. The extension offers a seamless, in-browser sticky note system to help users take notes and organize information while browsing the web.

This README serves to provide a clear understanding of its goals, features, and current implementation for potential employers and reviewers. While the project is still in development, the core functionality is ready for review.

---

<!-- ## Table of Contents

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

--- -->

## Overview

### About StickIt

**StickIt** is a Chrome extension designed to help users quickly jot down thoughts, tasks, or important web elements through sticky notes directly in the browser. It integrates seamlessly into the user’s browsing flow, ensuring notes persist across sessions using local storage.

This project showcases both front-end and back-end development skills, including a minimal UI, handling browser events, and managing storage mechanisms.

---

## Features

StickIt provides users with the following functionalities:

- **Create, Edit, and Delete Sticky Notes**: Users can create sticky notes from the extension popup, edit them, and delete them.
- **Persistent Notes**: Notes are saved locally and persist across sessions.
- **Customizable UI**: Sticky notes are draggable, and users can modify the note color for personalization.
- **Lightweight and Non-intrusive**: Designed to be minimal and efficient.

---

## Technologies Used

- **HTML/CSS/TypeScript**
- **Chrome Extensions API**
- **LocalStorage API**
- **ShadowDOM API**

---

## Installation (for Development/Review)

1. **Clone the Repository**:

   - Clone the repository locally.
     ```bash
     git clone https://github.com/mamack1/stickit.git
     ```

2. **Load the Extension in Chrome**:

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer Mode** in the upper-right corner.
   - Click on **Load unpacked** and select the directory where the StickIt repository is stored.

3. The StickIt extension will now be available in your browser toolbar.

**Note**: This project is a work in progress, and certain features may not be fully implemented yet.

---

## Usage

- **Create a new note**: Click the StickIt icon in the browser toolbar and choose one of the six colored squares to create a new note.
- **Edit a note**: Click any existing note to modify its content and utilize the toolbar to change the color.
- **Delete a note**: Use the "X" button to remove a note, or the toolbar option to delete all notes from the page.
- **Rearrange notes**: Drag the top of the note to move it around the page.

---

## Development Process

1. **Planning**: Focused on simplicity and integration.
2. **UI/UX Design**: Minimalist and easy to navigate.
3. **Implementation**:

   - TypeScript compiled to JavaScript.
   - Integrated Chrome's Extensions API and LocalStorage.

4. **Testing**: Conducted manual testing across various environments.

---

## Screenshots

![Demo](./imgs/demo/StickItDemo.gif)

---

## Future Plans

- **Open-source the project**.
- **Additional customization options**.
- **Sync across devices**.
- **Deploy on Chrome Web Store**.

---

## License

Currently, StickIt is a private project and is not licensed for public distribution. Upon open-sourcing, it will be released under the [MIT License](LICENSE).

---

## Contact

<img src="imgs/headshots/mike.jpg" alt="Mike Headshot" width="400" height="450">

### Michael Mack - Full Stack Developer

- **Email**: mkemack@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/michael-a-mack/
- **GitHub**: https://github.com/mamack1
