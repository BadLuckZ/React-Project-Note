import { useEffect, useState, useCallback } from "react";
import "@picocss/pico";
import "./App.css";

/**
 * Create the note area stored many created notes.
 */
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

/**
 * Create a delay for this value
 */
function useDebounceValue(value, delay) {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);
  return debounceValue;
}

function App() {
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [noteData, setNoteData] = useState({ title: "", content: "" });
  const [notes, setNotes] = useState(() => {
    const initialNotes = localStorage.getItem("notes");
    return JSON.parse(initialNotes) ?? [];
  });
  const debouncedNotes = useDebounceValue(notes, 2000);
  const [deletingItem, setDeletingItem] = useState(null);

  // Handle LocalStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [debouncedNotes]);

  // Syncing tabs
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

  const saveNote = useCallback(
    (newData) => {
      const existed = notes.find((note) => note.id === newData.id);
      if (existed) {
        setNotes(
          notes.map((note) => {
            if (note.id === noteData.id) {
              return newData;
            }
            return note;
          })
        );
      } else {
        setNotes([...notes, newData]);
      }
    },
    [notes]
  );

  // Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "x" && e.ctrlKey) {
        e.preventDefault();
        // Redo
        const lastNote = future[0];
        if (lastNote) {
          setHistory([noteData, ...history]);
          setNoteData(lastNote);
          saveNote(lastNote);
          setFuture(future.slice(1));
        }
      } else if (e.key === "z" && e.ctrlKey) {
        e.preventDefault();
        // Undo
        const prevNote = history[0];
        if (prevNote) {
          setHistory(history.slice(1));
          setNoteData(prevNote);
          saveNote(prevNote);
          setFuture([noteData, ...future]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [future, history, noteData, saveNote]);

  /**
   * Helps define a field to update with a value
   */
  const updateField = (field, value) => {
    if (noteData.id) {
      // Update the note
      const newData = {
        ...noteData,
        [field]: value,
      };
      saveNote(newData);
      setNoteData(newData);
      setHistory([noteData, ...history]);
    } else {
      // Create the new note
      const newId = Date.now();
      const newData = {
        ...noteData,
        id: newId,
        [field]: value,
      };
      saveNote(newData);
      setNoteData(newData);
      setHistory([noteData, ...history]);
    }
  };

  return (
    <main className="container">
      <div className="app-head">
        <h1 className="app-title">My Notes</h1>
        <button
          className="note-btn"
          onClick={() => {
            setNoteData({ title: "", content: "" });
          }}
        >
          Write
        </button>
      </div>
      {notes.length > 0 ? (
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
      ) : (
        <div className="empty-notes">No Notes</div>
      )}

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
                  setNoteData({ title: "", content: "" });
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

      {noteData && (
        <>
          <label htmlFor="note-title">
            Title
            <input
              type="text"
              id="note-title"
              name="note-title"
              placeholder="Title of the Note"
              onChange={(e) => updateField("title", e.target.value)}
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
              onChange={(e) => updateField("content", e.target.value)}
              value={noteData.content}
              required
            ></textarea>
          </label>

          <div style={{ display: "flex", gap: 16 }}>
            <button
              style={{ width: "auto" }}
              disabled={!history.length}
              onClick={() => {
                const prevNote = history[0];
                if (prevNote) {
                  setHistory(history.slice(1));
                  setNoteData(prevNote);
                  saveNote(prevNote);
                  setFuture([noteData, ...future]);
                }
              }}
            >
              Undo
            </button>
            <button
              style={{ width: "auto" }}
              disabled={!future.length}
              onClick={() => {
                const lastNote = future[0];
                if (lastNote) {
                  setHistory([noteData, ...history]);
                  setNoteData(lastNote);
                  saveNote(lastNote);
                  setFuture(future.slice(1));
                }
              }}
            >
              Redo
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default App;
