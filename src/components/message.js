import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';

class Message extends LitElement {
  static get properties() {
    return {
      model: { type: Object },
    };
  }

  render() {
    return html`
    <span>Message: ${this.model.text}</span>
    `;
  }
}

export { Message };
