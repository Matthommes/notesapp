const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const descInput = document.querySelector("#desc");
const contentInput = document.querySelector("#content");
const taskContainer = document.querySelector(".taskbar");
const button = document.querySelector("button");
const editButton = document.querySelectorAll(".edit");
const notesContainer = document.querySelector("#notes-container");
const noteList = document.querySelectorAll("#notes-container .note");
const search = document.querySelector("#search");
const toggle = document.querySelector(".top img");
const body = document.querySelector("body");

let notes = [];


const newSrc = document.body.classList.contains("dark") 
  ? "/images/bulb-on.svg"
  : "/images/bulb-off.svg";

toggle.src = newSrc;
// Save the user's preference in localStorage

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle("dark"); ;
  const newSrc = isDarkMode ? "./images/bulb-on.svg" : "./images/bulb-off.svg";
  toggle.src = newSrc;
  localStorage.setItem("darkMode", isDarkMode ? "true" : "false");

  const rootStyles = document.documentElement.style;
  if (isDarkMode) {

    rootStyles.setProperty(
      "--background-color",
      "var(--dark-background-color)"
    );
    rootStyles.setProperty("--text-color", "var(--dark-text-color)");
    rootStyles.setProperty(
      "--input-background",
      "var(--dark-input-background)"
    );
    rootStyles.setProperty("--input-text", "var(--dark-input-text)");
    rootStyles.setProperty("--note-background", "var(--dark-note-background)");
    rootStyles.setProperty("--note-shadow", "var(--dark-note-shadow)");
  } else {
    
    rootStyles.setProperty("--background-color", "var(--light-background-color)");
    rootStyles.setProperty("--text-color", "var(--light-text-color)");
    rootStyles.setProperty("--input-background", "var(--light-input-background)");
    rootStyles.setProperty("--input-text", "var(--light-input-text)");
    rootStyles.setProperty("--note-background", "var(--light-note-background)");
    rootStyles.setProperty("--note-shadow", "var(--light-note-shadow)");
  }
}
function checkDarkModePreference(event) {
  const isDarkModePreferred = event.matches;
  console.log(isDarkModePreferred);
  if (isDarkModePreferred) {
    body.classList.add("dark");
    toggle.src = "./images/bulb-on.svg";
  } else {
    body.classList.remove("dark");
    toggle.src = "./images/bulb-off.svg";
  }
}

// Set the initial state of the bulb based on media preference
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
console.log(darkModeMediaQuery);
checkDarkModePreference(darkModeMediaQuery);
darkModeMediaQuery.addEventListener("DomContentLoad", checkDarkModePreference);

function showTaskbar() {
  taskContainer.style.display = "block";
}
// Check if the user has a dark mode preference and set it

const darkModePreference = localStorage.getItem("darkMode");
if (darkModePreference === "true") {
  body.classList.add("dark");
  const newSrc = "./images/bulb-on.svg";
  toggle.src = newSrc;
} else {
  body.classList.remove("dark");
  const newSrc = "./images/bulb-off.svg";
  toggle.src = newSrc;
}

search.addEventListener("input", handleSearch);

function handleSearch() {
  const searchTerm = search.value.toLowerCase();
  const noteElements = document.querySelectorAll("#notes-container .note");

  noteElements.forEach((noteElement) => {
    const noteTitle = noteElement.querySelector("h3").textContent.toLowerCase();
    const noteDescription = noteElement
      .querySelector("h6")
      .textContent.toLowerCase();

    if (
      noteTitle.includes(searchTerm)
      // noteDescription.includes(searchTerm)
    ) {
      noteElement.style.display = "block";
    } else {
      noteElement.style.display = "none";
    }
  });
}

function noteId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
function closeTaskBar() {
  taskContainer.style.display = "none";
}

function handleInputChange() {
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const content = contentInput.value.trim();
  button.disabled = !(title && description && content);
}
titleInput.addEventListener("input", handleInputChange);
descInput.addEventListener("input", handleInputChange);
contentInput.addEventListener("input", handleInputChange);
button.addEventListener("click", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !description || !content) {
    console.log("Please fill in all the inputs");
    return;
  }

  function createNote() {
    const note = {
      id: noteId(),
      title: title,
      description: description,
      content: content,
      date: getCurrentDate(),
      completed: false,
    };

    notes.push(note);
    renderNotes();
    form.reset();

    const noteString = JSON.stringify(notes);
    localStorage.setItem("notes", noteString);
    return note;
  }

  createNote();
  if (window.innerWidth <= 767) {
    taskContainer.style.display = "none";
  }
  button.disabled = true;
});
window.addEventListener("DOMContentLoaded", (e) => {
  const storedNotes = localStorage.getItem("notes");
  if (storedNotes) {
    notes = JSON.parse(storedNotes);
    renderNotes();
  }
});

function getCurrentDate() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${month} ${day}, ${year}`;
  return formattedDate;
}

function renderNotes() {
  notesContainer.innerHTML = "";
  notes.forEach((note) => {
    const noteItem = document.createElement("li");
    noteItem.classList.add("note");
    noteItem.innerHTML = `
      <h3>${note.title} </h3>
      <h6>${note.description}</h6>
     <div> <p>${note.date}</p>
     <button class="delete">
     <i class="fa-solid fa-trash-alt"></i>
     </button>
     </div>
    `;
    noteItem.addEventListener("click", () => {
      // Redirect to note.html with the note ID as a query parameter
      window.location.href = `note.html?id=${note.id}`;
    });
    noteItem.setAttribute("data-note-id", note.id);
    notesContainer.appendChild(noteItem);
    const deleteButtons = noteItem.querySelectorAll(".delete");
    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const noteItem = e.target.closest(".note");
        const noteId = noteItem.dataset.noteId;
        deleteNoteById(noteId);
        noteItem.remove();
      });
    });
  });
}
function deleteNoteById(noteId) {
  notes = notes.filter((note) => note.id !== noteId);
  saveNotesToLocalStorage();
}
function saveNotesToLocalStorage() {
  const noteString = JSON.stringify(notes);
  localStorage.setItem("notes", noteString);
}
