import anime from 'animejs';
import api from '../api.js';
import SpawnSwal from './SwalAlert.js';

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
            form {
                background: var(--card-bg, #fff);
                padding: 3rem;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 2rem;
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            input, textarea {
                width: -webkit-fill-available;
                padding: 0.8rem;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            input:focus, textarea:focus {
                outline: none;
                border-color: var(--primary, #3498db);
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
            button:hover {
                background: var(--secondary, #2980b9);
            }
            button:disabled {
                background:rgb(60, 54, 54);
                cursor: not-allowed;
            }
            .error {
                color: #ff4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            }
        </style>
      <form id="noteForm">
        <div class="form-group">
          <label for="title">Judul Catatan</label>
          <input type="text" id="title" required>
          <div class="error" id="titleError"></div>
        </div>
        <div class="form-group">
          <label for="body">Isi Catatan</label>
          <textarea id="body" rows="4" required></textarea>
          <div class="error" id="bodyError"></div>
        </div>
        <button type="submit" id='add-button' disabled>Tambah Catatan</button>
      </form>
    `;
    anime({
      targets: this.shadowRoot.host,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });

    this.form = this.shadowRoot.getElementById('noteForm');
    this.titleInput = this.shadowRoot.getElementById('title');
    this.bodyInput = this.shadowRoot.getElementById('body');
    this.submitButton = this.shadowRoot.querySelector('button');

    this.setupValidation();

    this.form.addEventListener('submit', this.handleSubmit);
  }

  setupValidation() {
    const validate = () => {
      const titleValid = this.titleInput.value.trim().length >= 3;
      const bodyValid = this.bodyInput.value.trim().length >= 5;

      this.shadowRoot.getElementById('titleError').textContent = titleValid
        ? ''
        : 'Judul harus minimal 3 karakter';
      this.shadowRoot.getElementById('bodyError').textContent = bodyValid
        ? ''
        : 'Isi harus minimal 5 karakter';

      this.submitButton.disabled = !(titleValid && bodyValid);
    };

    anime({
      targets: this.submitButton,
      backgroundColor: this.titleInput && this.bodyInput ? 'var(--primary, #3498db)' : 'rgb(60, 54, 54)',
      scale: this.titleInput && this.bodyInput ? 1.05 : 1,
      duration: 300,
    });

    this.titleInput.addEventListener('input', validate);
    this.bodyInput.addEventListener('input', validate);
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.submitButton.disabled) return;
    const loadingAnim = anime({
      targets: this.submitButton,
      rotate: '1turn',
      duration: 1500,
      loop: true,
      easing: 'linear',
      begin: () => {
        this.submitButton.innerHTML = 'Menyimpan...';
      },
    });
    try {
      await api.createNote({
        title: this.titleInput.value.trim(),
        body: this.bodyInput.value.trim(),
      });

      this.dispatchEvent(new CustomEvent('note-created'));
      this.form.reset();
      this.submitButton.disabled = true;

      window.location.reload();
    } catch (error) {
      anime({
        targets: this.form,
        translateX: [-10, 10, -10, 10, 0],
        duration: 800,
        easing: 'easeInOutSine',
      });

      SpawnSwal('error', 'Gagal membuat catatan', error.message);
    } finally {
      loadingAnim.pause();
      this.submitButton.innerHTML = 'Tambah Catatan';
      anime({
        targets: this.submitButton,
        rotate: 0,
        duration: 200,
      });
    }
  };
}

customElements.define('note-form', NoteForm);
