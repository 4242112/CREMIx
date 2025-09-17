import apiClient from './apiClient';

export const NoteLocation = {
  LEAD: 'LEAD',
  OPPORTUNITY: 'OPPORTUNITY',
  CUSTOMER: 'CUSTOMER'
};

const BASE_URL = '/notes';

const NotesService = {
  getAllNotes: async () => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all notes:', error);
      return [];
    }
  },

  getNotesByLocation: async (location, id) => {
    if (!id) {
      console.error('Location ID is required');
      return [];
    }

    try {
      console.log(`Fetching notes for ${location} ID: ${id}`);
      const response = await apiClient.get(`${BASE_URL}/${location}/${id}`);
      console.log(`Found ${response.data.length} notes for ${location} ID: ${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notes for ${location} ID ${id}:`, error);
      return [];
    }
  },

  createNote: async (note) => {
    try {
      console.log('Creating note:', note);
      const response = await apiClient.post(BASE_URL, note);
      console.log('Note created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      return null;
    }
  },

  updateNote: async (note) => {
    if (!note.id) {
      console.error('Note ID is required for updates');
      return null;
    }

    try {
      console.log(`Updating note ID ${note.id}:`, note);
      const response = await apiClient.put(`${BASE_URL}/${note.id}`, note);
      console.log('Note updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating note ID ${note.id}:`, error);
      return null;
    }
  },

  deleteNote: async (id) => {
    try {
      console.log(`Deleting note ID ${id}`);
      await apiClient.delete(`${BASE_URL}/${id}`);
      console.log(`Note ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting note ID ${id}:`, error);
    }
  }
};

export default NotesService;
