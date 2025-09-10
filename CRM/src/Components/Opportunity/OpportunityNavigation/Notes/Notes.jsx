import React, { useState, useEffect } from 'react';
import NotesService from '../../../../services/NotesService';

const NotesButton = ({ opportunity }) => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    location: 'OPPORTUNITY',
  });

  const fetchNotes = async () => {
    if (!opportunity?.lead?.id) return;
    setLoading(true);
    try {
      const data = await NotesService.getNotesByLocation('LEAD', opportunity.lead.id);
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
      note.location = 'LEAD';
      note.locationId = opportunity?.lead?.id;
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
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
      resetForm();
    } catch (err) {
      setError('Failed to update note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await NotesService.deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete note');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingNoteId(null);
    setNoteForm({ title: '', description: '', location: 'OPPORTUNITY' });
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
    if (opportunity?.lead?.id) {
      fetchNotes();
      setNoteForm({
        title: '',
        description: '',
        location: 'LEAD',
        locationId: opportunity.lead.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunity]);

  if (!opportunity?.lead) return null;

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 py-3">
        <h5 className="text-lg font-semibold">Notes</h5>
        <button
          className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Note
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-3">Loading...</div>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">No notes available for this Opportunity.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <h6 className="font-semibold">
                  <strong>Title:</strong> {note.title}
                </h6>
                <hr className="my-2" />
                <p>
                  <strong>Description:</strong> {note.description}
                </p>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                    onClick={() => {
                      setEditingNoteId(note.id);
                      setNoteForm({
                        title: note.title,
                        description: note.description,
                        location: 'LEAD',
                        locationId: opportunity.lead.id,
                      });
                      setShowModal(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                    onClick={() => deleteNote(note.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="flex justify-between items-center border-b px-4 py-3">
                <h5 className="text-lg font-semibold">
                  {editingNoteId ? 'Edit Note' : 'Add New Note'}
                </h5>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={noteForm.title}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      value={noteForm.description}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t px-4 py-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="px-4 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {loading
                      ? 'Saving...'
                      : editingNoteId
                      ? 'Update Note'
                      : 'Save Note'}
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
