import React, { useState, useEffect } from 'react';
import NotesService, { NoteLocation } from '../../../../../services/NotesService';

const NotesButton = ({ lead }) => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    location: NoteLocation.LEAD,
  });

  const fetchNotes = async () => {
    if (!lead?.id) return;
    setLoading(true);
    try {
      const data = await NotesService.getNotesByLocation(NoteLocation.LEAD, lead.id);
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (note) => {
    setLoading(true);
    try {
      note.location = NoteLocation.LEAD;
      note.locationId = lead?.id;
      const savedNote = await NotesService.createNote(note);
      setNotes([...notes, savedNote]);
      resetForm();
    } catch (err) {
      setError('Failed to save note.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (note) => {
    setLoading(true);
    try {
      const updated = await NotesService.updateNote(note);
      setNotes(notes.map(n => (n.id === updated.id ? updated : n)));
      resetForm();
    } catch (err) {
      setError('Failed to update note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await NotesService.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingNoteId(null);
    setNoteForm({ title: '', description: '', location: NoteLocation.LEAD });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteForm({ ...noteForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNoteId) {
      updateNote({ ...noteForm, id: editingNoteId });
    } else {
      addNote(noteForm);
    }
  };

  useEffect(() => {
    if (lead?.id) {
      fetchNotes();
      setNoteForm({ title: '', description: '', location: NoteLocation.LEAD, locationId: lead.id });
    }
  }, [lead]);

  if (!lead) return null;

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h5 className="text-lg font-semibold">Notes</h5>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center gap-1"
          onClick={() => setShowModal(true)}
        >
          <span className="material-icons text-sm">note_add</span> Add Note
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {error && <div className="text-red-600 mb-2">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">No notes available for this lead.</p>
        ) : (
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className="border border-gray-200 rounded p-3 shadow-sm">
                <h6 className="font-medium"><strong>Title:</strong> {note.title}</h6>
                <hr className="my-2" />
                <p className="text-gray-700"><strong>Description:</strong> {note.description}</p>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="px-2 py-1 border border-blue-500 text-blue-500 rounded text-sm hover:bg-blue-50 flex items-center gap-1"
                    onClick={() => {
                      setEditingNoteId(note.id);
                      setNoteForm({
                        title: note.title,
                        description: note.description,
                        location: NoteLocation.LEAD,
                        locationId: lead.id,
                      });
                      setShowModal(true);
                    }}
                  >
                    <span className="material-icons text-sm">edit</span> Edit
                  </button>
                  <button
                    className="px-2 py-1 border border-red-500 text-red-500 rounded text-sm hover:bg-red-50 flex items-center gap-1"
                    onClick={() => deleteNote(note.id)}
                  >
                    <span className="material-icons text-sm">delete</span> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md">
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                <h5 className="font-semibold">{editingNoteId ? 'Edit Note' : 'Add New Note'}</h5>
                <button className="text-gray-500 hover:text-gray-700" onClick={resetForm}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={noteForm.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={4}
                      value={noteForm.description}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end px-4 py-3 border-t border-gray-200 gap-2">
                  <button
                    type="button"
                    className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : editingNoteId ? 'Update Note' : 'Save Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesButton;
