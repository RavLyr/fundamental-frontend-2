class AppHeader extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          header {
            background-color: #4CAF50;
            color: white;
            padding: 1rem;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
  
          h1 {
            margin: 0;
            font-size: 2rem;
          }
  
          nav {
            margin-top: 0.5rem;
          }
  
          nav button {
            background: none;
            border: none;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            margin: 0 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
          }
  
          nav button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
  
          nav button.active {
            background-color: rgba(255, 255, 255, 0.2);
          }
        </style>
        <header>
          <h1>📝 Notes App</h1>
          <nav>
            <button data-filter="active" class="active">Catatan Aktif</button>
            <button data-filter="archived">Catatan Arsip</button>
          </nav>
        </header>
      `;
  
      // Tambahkan event listener untuk tombol navigasi
      this.shadowRoot.querySelectorAll('nav button').forEach(button => {
        button.addEventListener('click', () => {
          // Hapus class active dari semua tombol
          this.shadowRoot.querySelectorAll('nav button').forEach(btn => {
            btn.classList.remove('active');
          });
  
          // Tambahkan class active ke tombol yang diklik
          button.classList.add('active');
  
          // Dispatch event untuk mengubah tampilan catatan
          const filter = button.dataset.filter;
          this.dispatchEvent(new CustomEvent('filter-change', { detail: { filter } }));
        });
      });
    }
  }
  
  // Definisikan custom element untuk header
  customElements.define('app-header', AppHeader);