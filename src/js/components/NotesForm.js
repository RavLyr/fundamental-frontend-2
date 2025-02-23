import api from '../api.js';

class NoteForm extends HTMLElement {
  // ... kode sebelumnya ...

  handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.createNote({
        title: this.titleInput.value.trim(),
        body: this.bodyInput.value.trim()
      });
      
      this.dispatchEvent(new CustomEvent('note-created'));
      this.form.reset();
    } catch (error) {
      alert(`Gagal membuat catatan: ${error.message}`);
    }
  };
}

customElements.define('note-form', NoteForm);