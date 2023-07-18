const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const descInput = document.querySelector("#desc");
const contentInput = document.querySelector("#content");
const taskContainer = document.querySelector(".taskbar");
const button = document.querySelector("button");
const editButton = document.querySelectorAll(".edit");
const notesContainer = document.querySelector("#notes-container");
const xmark = document.querySelector(".close");
const add = document.querySelector(".add");

let notes = [];

function noteId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
xmark.addEventListener("click", (e) => {
  taskContainer.style.display = "none";
});

add.addEventListener("click", (e) => {
  taskContainer.style.display = "block";
});
button.addEventListener("click", (e) => {
  e.preventDefault();

  const title = titleInput.value;
  const description = descInput.value;
  const content = contentInput.value;

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
      <h3>${note.title}</h3>
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
