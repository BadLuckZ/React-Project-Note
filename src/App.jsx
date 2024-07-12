import { useState } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState([]);
  const [deletingItem, setDeletingItem] = useState(null);

  return (
    <main className="container">
      <h1 className="app-title">My Notes</h1>
      <div className="note-list">
        {notes.map((note) => (
          <article key={note.id} className="note-item">
            <div className="note-title">{note.title}</div>
            <button
              className="note-edit-btn"
              onClick={() => {
                setNoteData(note);
              }}
            >
              Edit
            </button>
            <button
              className="note-delete-btn"
              onClick={() => {
                setDeletingItem(note);
              }}
            >
              Delete
            </button>
          </article>
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
