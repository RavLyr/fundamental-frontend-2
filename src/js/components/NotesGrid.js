import api from '../api.js';
import LoadingIndicator from '../utils/loader.js';
import NoteCard from './NoteCard.js';

class NotesGrid extends HTMLElement {
  constructor() {
    super();
    this.state = {
      notes: [],
      showArchived: false,
      loading: true,
      error: null,
    };
  }

  connectedCallback() {
    this.loadData();
    this.render();
  }

  async loadData() {
    try {
      this.state.loading = true;
      this.render();
      
      this.state.notes = this.state.showArchived
        ? await api.getArchivedNotes()
        : await api.getActiveNotes();
      
      this.state.error = null;
    } catch (error) {
      this.state.error = error.message;
    } finally {
      this.state.loading = false;
      this.render();
    }
  }

  handleArchive = async (id) => {
    try {
      await api.archiveNote(id);
      await this.loadData();
    } catch (error) {
      alert(`Gagal mengarsip: ${error.message}`);
    }
  };

  handleUnarchive = async (id) => {
    try {
      await api.unarchiveNote(id);
      await this.loadData();
    } catch (error) {
      alert(`Gagal membuka arsip: ${error.message}`);
    }
  };

  handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus catatan ini?')) {
      try {
        await api.deleteNote(id);
        await this.loadData();
      } catch (error) {
        alert(`Gagal menghapus: ${error.message}`);
      }
    }
  };

  render() {
    if (this.state.loading) {
      this.innerHTML = '<loading-indicator></loading-indicator>';
      return;
    }

    if (this.state.error) {
      this.innerHTML = `<div class="error">${this.state.error}</div>`;
      return;
    }

    this.innerHTML = `
      <div class="note-filter">
        <button class="${!this.state.showArchived ? 'active' : ''}" 
          data-filter="active">Aktif</button>
        <button class="${this.state.showArchived ? 'active' : ''}" 
          data-filter="archived">Arsip</button>
      </div>
      <div class="grid-container">
        ${this.state.notes.map(note => `
          <note-card
            id="${note.id}"
            title="${note.title}"
            body="${note.body}"
            date="${new Date(note.createdAt).toLocaleDateString()}"
            archived="${note.archived}"
          ></note-card>
        `).join('')}
      </div>
    `;

    // Event listeners
    this.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        this.state.showArchived = button.dataset.filter === 'archived';
        this.loadData();
      });
    });

    this.querySelectorAll('note-card').forEach(card => {
      card.addEventListener('archive', () => this.handleArchive(card.noteId));
      card.addEventListener('unarchive', () => this.handleUnarchive(card.noteId));
      card.addEventListener('delete', () => this.handleDelete(card.noteId));
    });
  }
}

customElements.define('notes-grid', NotesGrid);