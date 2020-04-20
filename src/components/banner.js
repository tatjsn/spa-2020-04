import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';
import { fromRequire } from '../customEvents.js';

class Banner extends LitElement {
  static get properties() {
    return {
      model: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(fromRequire('app-message', this));
  }

  render() {
    return html`
    <p>
      Banner
      <app-message .model="${this.model.deps.message}"></app-banner>
    </p>
    `;
  }
}

export { Banner };
