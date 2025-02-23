// Import komponen-komponen yang diperlukan
import './components/AppHeader.js';
import './components/NoteForm.js';
import './components/NotesGrid.js';
import './utils/loader.js';

class NotesApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }
      </style>
      <app-header></app-header>
      <main>
        <note-form></note-form>
        <notes-grid></notes-grid>
      </main>
    `;
  }

  setupEventListeners() {
    this.shadowRoot.querySelector('note-form').addEventListener('note-created', () => {
      this.shadowRoot.querySelector('notes-grid').loadData();
    });
  }
}

customElements.define('notes-app', NotesApp);

document.body.innerHTML = '<notes-app></notes-app>';