const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const api = {
  async fetchJson(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message || 'Failed to fetch data');
    }

    return responseJson.data;
  },

  // Get all active notes
  getActiveNotes() {
    return this.fetchJson(`${BASE_URL}/notes`);
  },

  // Get archived notes
  getArchivedNotes() {
    return this.fetchJson(`${BASE_URL}/notes/archived`);
  },

  // Get note by ID
  getNoteById(id) {
    return this.fetchJson(`${BASE_URL}/notes/${id}`);
  },

  // Create new note
  createNote({ title, body }) {
    return this.fetchJson(`${BASE_URL}/notes`, {
      method: 'POST',
      body: JSON.stringify({ title, body }),
    });
  },

  // Archive note
  archiveNote(id) {
    return this.fetchJson(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    });
  },

  // Unarchive note
  unarchiveNote(id) {
    return this.fetchJson(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
  },

  // Delete note
  deleteNote(id) {
    return this.fetchJson(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default api;
