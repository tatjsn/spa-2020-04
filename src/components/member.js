import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';

class Member extends LitElement {
  static get properties() {
    return {
      model: { type: Object },
    };
  }
  render() {
    return html`
    <h1>${this.model.name}</h1>
    <h2>Class: ${this.model.class}</h2>
    <p>
      <button type="button" @click="${() => window.store.dispatch({ type: 'navigate.team' })}">
        Go to team page
      </button>
    </p>
    `;
  }
}

export { Member };
