import { useState } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState([]);

  return (
    <main className="container">
      <h1 className="app-title">My Notes</h1>
      <div className="note-list">
        {notes.map((note, index) => (
          <article key={index} className="note-item">
            <div className="note-title">{note.title}</div>
            <button
              className="note-edit-btn"
              onClick={() => {
                setNoteData(note);
              }}
            >
              Edit
            </button>
          </article>
        ))}
      </div>

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
