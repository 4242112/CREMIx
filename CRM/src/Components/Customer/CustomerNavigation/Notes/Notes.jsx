import React, { useState, useEffect } from 'react';
import { Customer } from '../../../../services/CustomerService';
import NotesService, { Note, NoteLocation } from '../../../../services/NotesService';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

const NotesButton = ({ customer }) => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    location: NoteLocation.CUSTOMER,
  });

  const fetchNotes = async () => {
    if (!customer?.id) return;
    setLoading(true);
    try {
      const data = await NotesService.getNotesByLocation(NoteLocation.CUSTOMER, customer.id);
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
      note.location = NoteLocation.CUSTOMER;
      note.locationId = customer?.id;
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
      setError('Failed to update note.');
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
    setNoteForm({ title: '', description: '', location: NoteLocation.CUSTOMER });
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
    if (customer?.id) {
      fetchNotes();
      setNoteForm({ title: '', description: '', location: NoteLocation.CUSTOMER, locationId: customer.id });
    }
  }, [customer]);

  return (
    <div className="bg-white shadow-sm rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h5 className="text-lg font-semibold">Notes</h5>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" /> Add Note
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>}
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">No notes available for this Customer.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="bg-gray-50 p-4 rounded shadow-sm">
                <h6 className="font-semibold mb-2">Title: {note.title}</h6>
                <p className="text-gray-700 mb-2">Description: {note.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingNoteId(note.id);
                      setNoteForm({
                        title: note.title,
                        description: note.description,
                        location: NoteLocation.CUSTOMER,
                        locationId: customer?.id,
                      });
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 px-2 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                  >
                    <PencilIcon className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="flex items-center gap-1 px-2 py-1 border border-red-600 text-red-600 rounded hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-lg overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <h5 className="text-lg font-semibold">{editingNoteId ? 'Edit Note' : 'Add New Note'}</h5>
                <button onClick={resetForm} className="text-gray-600 hover:text-gray-800">
                  <XMarkIcon className="w-5 h-5" />
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
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={noteForm.description}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-4 py-3 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
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
