import { useState } from "react";
import "@picocss/pico";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  return (
    <main className="container">
      <h1 className="app-title">My Notes</h1>
      <div className="note-list">
        {notes.map((note, index) => (
          <article key={index} className="note-item">
            <div className="note-title">{note.title}</div>
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
            setTitle(event.target.value);
          }}
          value={title}
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
            setContent(event.target.value);
          }}
          value={content}
          required
        />
      </label>

      <button
        onClick={() => {
          setNotes([...notes, { title, content }]);
          setTitle("");
          setContent("");
        }}
      >
        Save
      </button>
    </main>
  );
}

export default App;
