class AppHeader extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <header>
          <h1>📝 Notes App</h1>
      </header>
    `;
  }
}
customElements.define('app-header', AppHeader);
