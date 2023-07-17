const noteId = getNoteIdFromURL();
const notes = getNotesFromLocalStorage();
let note = findNoteById(noteId, notes);
const editButton = document.querySelector("#edit");

if (note) {
  // Update the HTML elements with the note data
  document.getElementById("note-title").textContent = note.title;
  document.getElementById("note-description").textContent = note.description;
  document.getElementById("note-content").textContent = note.content;

  // Make the note fields editable
  document.getElementById("note-title").setAttribute("contentEditable", true);
  document
    .getElementById("note-description")
    .setAttribute("contentEditable", true);
  document.getElementById("note-content").setAttribute("contentEditable", true);
} else {
  console.log("Note not found");
}

function getNoteIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function getNotesFromLocalStorage() {
  const storedNotes = localStorage.getItem("notes");
  return storedNotes ? JSON.parse(storedNotes) : [];
}

function findNoteById(id, notes) {
  return notes.find((note) => note.id === id);
}

editButton.addEventListener("click", (e) => {
  e.preventDefault();
  const updatedTitle = document.getElementById("note-title").textContent;
  const updatedDescription =
    document.getElementById("note-description").textContent;
  const updatedContent = document.getElementById("note-content").textContent;
  note.title = updatedTitle;
  note.description = updatedDescription;
  note.content = updatedContent;

  // Save the updated notes array to localStorage
  saveNotesToLocalStorage();
});

function saveNotesToLocalStorage() {
  const noteString = JSON.stringify(notes);
  localStorage.setItem("notes", noteString);
}
