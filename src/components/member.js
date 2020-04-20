import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';
import { fromAction, fromRequire } from '../customEvents.js';

class Member extends LitElement {
  static get properties() {
    return {
      model: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(fromRequire('member', this));
  }

  render() {
    return html`
    <h1>${this.model.name}</h1>
    <h2>Class: ${this.model.class}</h2>
    <p>
      <img src="${this.model.image}" width="640">
    </p>
    <p>
      <button type="button" @click="${() => this.dispatchEvent(fromAction({ type: 'navigate.team' }))}">
        Go to team page
      </button>
    </p>
    `;
  }
}

export { Member };
