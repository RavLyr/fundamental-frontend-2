import api from '../api.js';
import LoadingIndicator from '../utils/loader.js';
import NoteCard from './NoteCard.js';
import SpawnSwal from './SwalAlert.js';

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
      SpawnSwal('error', `Gagal mengarsipkan catatan`, error.message);
    }
  };

  handleUnarchive = async (id) => {
    try {
      await api.unarchiveNote(id);
      await this.loadData();
    } catch (error) {
      SpawnSwal('error', `Gagal membuka arsip`, error.message);

    }
  };

  handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus catatan ini?')) {
      try {
        await api.deleteNote(id);
        await this.loadData();
      } catch (error) {
      SpawnSwal('error', `Gagal menghapus`, error.message);

        
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
    <style>
            .grid-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
                padding: 1rem 0;
            }
                
            button {
                background: var(--primary, #3498db);
                color: white;
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .note-filter{
              display:flex;
              gap:1rem;
            }
            button:hover {
                background: var(--secondary, #2980b9);
            }
        </style>
      <div class="note-filter">
        <button class="${!this.state.showArchived ? 'active' : ''} filter-button" 
          data-filter="active">Aktif</button>
        <button class="${this.state.showArchived ? 'active' : ''} filter-button" 
          data-filter="archived">Arsip</button>
      </div>
      <div class="grid-container">
        ${this.state.notes
          .map(
            (note) => `
          <note-card
            id="${note.id}"
            title="${note.title}"
            body="${note.body}"
            date="${new Date(note.createdAt).toLocaleDateString()}"
            archived="${note.archived}"
          ></note-card>
        `
          )
          .join('')}
      </div>
    `;

    // Event listeners
    this.querySelectorAll('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        this.state.showArchived = button.dataset.filter === 'archived';
        this.loadData();
      });
    });

    this.querySelectorAll('note-card').forEach((card) => {
      card.addEventListener('archive', () => this.handleArchive(card.id));
      card.addEventListener('unarchive', () => this.handleUnarchive(card.id));
      card.addEventListener('delete', () => this.handleDelete(card.id));
    });
  }
}

customElements.define('notes-grid', NotesGrid);
