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
           .card {
                background: var(--card-bg, #fff);
                border-radius: 10px;
                padding: 1.5rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: transform 0.2s ease;
                position: relative;
                max-width: 400px;
                margin: auto;
                word-wrap: break-word;
            }
            .card:hover {
                transform: translateY(-2px);
            }
            h3 {
                color: var(--primary, #3498db);
                margin-bottom: 0.5rem;
            }
            p {
                color: var(--text, #333);
                margin-bottom: 1rem;
                line-height: 1.5;
                white-space: pre-wrap;
            }
            .date {
                font-size: 0.875rem;
                color: #666;
            }
            .actions {
              margin-top: 1rem;
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
            }
            .actions button {
                background: transparent;
                border: none;
                cursor: pointer;
                margin-left: 0.5rem;
                font-size: 0.9rem;
                color: var(--primary, #3498db);
            }
            .actions button:hover {
                color: var(--secondary, #2980b9);
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
