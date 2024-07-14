import { useEffect, useState } from "react";
import "@picocss/pico";
import "./App.css";

function NoteWidget({ note, editing, onEditNote, onDeleteNote }) {
  return (
    <article
      key={note.id}
      className={`note-item ${editing ? "note-editing" : ""}`}
    >
      <div className="note-title">{note.title}</div>
      <button
        className="note-edit-btn"
        onClick={() => {
          onEditNote?.(note);
          // if (onEditNote) { onEditNote(note) }
        }}
      >
        Edit
      </button>
      <button
        className="note-delete-btn"
        onClick={() => {
          onDeleteNote?.(note);
          // if (onDeleteNote) { onDeleteNote(note) }
        }}
      >
        Delete
      </button>
    </article>
  );
}

function App() {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState(() => {
    return JSON.parse(localStorage.getItem("notes") ?? "[]");
  });
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === "notes") {
        setNotes(JSON.parse(e.newValue) ?? []);
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <main className="container">
      <h1 className="app-title">My Notes</h1>
      <div className="note-list">
        {notes.map((note) => (
          <NoteWidget
            note={note}
            editing={note.id === noteData.id}
            onEditNote={() => {
              setNoteData(note);
            }}
            onDeleteNote={() => {
              setDeletingItem(note);
            }}
          />
        ))}
      </div>

      {/* Remove Note Decision */}
      {deletingItem ? (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-title">Are you sure?</div>
            <p className="modal-note">
              To delete "{deletingItem.title}" note, Click the "Submit" Button!
            </p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setNotes(
                    notes.filter((noteData) => noteData.id !== deletingItem.id)
                  );
                  setDeletingItem(null);
                }}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setDeletingItem(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <br />

      <label htmlFor="note-title">
        Title
        <input
          type="text"
          id="note-title"
          name="note-title"
          placeholder="Title of the Note"
          onChange={(event) => {
            setNoteData({ ...noteData, title: event.target.value });
          }}
          value={noteData.title}
          required
        />
      </label>

      <label htmlFor="note-content">
        Content
        <textarea
          type="text"
          id="note-content"
          name="note-content"
          placeholder="Have any idea? Write it!"
          onChange={(event) => {
            setNoteData({ ...noteData, content: event.target.value });
          }}
          value={noteData.content}
          required
        />
      </label>

      <button
        onClick={() => {
          // Save the title and content
          if (noteData.id) {
            // Save to the exist note
            setNotes(
              notes.map((note) => {
                if (note.id === noteData.id) {
                  return noteData;
                }
                return note;
              })
            );
          } else {
            // Save as the new note
            setNotes([...notes, { ...noteData, id: Date.now() }]);
          }
          setNoteData({ title: "", content: "" });
        }}
      >
        Save
      </button>
    </main>
  );
}

export default App;
