class NoteCard extends HTMLElement {
    static get observedAttributes() {
      return ['id', 'title', 'body', 'date', 'archived'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'archived') {
        this.toggleArchiveState(newValue === 'true');
      }
      this.render();
    }
  
    toggleArchiveState(isArchived) {
      this.isArchived = isArchived;
    }
  
    render() {
      const actions = this.isArchived 
        ? `<button class="unarchive-btn">Buka Arsip</button>`
        : `<button class="archive-btn">Arsipkan</button>`;
  
      this.shadowRoot.innerHTML = `
        <style>
          /* Tambahkan styling sesuai kebutuhan */
          .card {
            position: relative;
          }
          .actions {
            margin-top: 1rem;
            display: flex;
            gap: 0.5rem;
          }
        </style>
        <div class="card">
          <h3>${this.getAttribute('title')}</h3>
          <p>${this.getAttribute('body')}</p>
          <div class="date">${this.getAttribute('date')}</div>
          <div class="actions">
            ${actions}
            <button class="delete-btn">Hapus</button>
          </div>
        </div>
      `;
  
      // Event listeners
      const actionBtn = this.shadowRoot.querySelector('.archive-btn, .unarchive-btn');
      const deleteBtn = this.shadowRoot.querySelector('.delete-btn');
  
      actionBtn?.addEventListener('click', () => {
        const eventType = this.isArchived ? 'unarchive' : 'archive';
        this.dispatchEvent(new CustomEvent(eventType));
      });
  
      deleteBtn?.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('delete'));
      });
    }
  }
  
  customElements.define('note-card', NoteCard);