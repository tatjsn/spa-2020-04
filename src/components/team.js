import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';

class Team extends LitElement {
  static get properties() {
    return {
      model: { type: Array },
    };
  }
  render() {
    return html`
    <h1>Team</h1>
    <ul>
      ${this.model.map(member => html`<li>${member.name}</li>`)}
    </ul>
    <p>
      <button type="button" @click="${() => window.store.dispatch({ type: 'navigate.home' })}">
        Go to home page
      </button>
    </p>
    `;
  }
}

export { Team };
