import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';

class Banner extends LitElement {
  static get dependencies() {
    return ['app-message'];
  }

  render() {
    return html`
    <p>
      Banner <app-message></app-message>
    </p>
    `;
  }
}

export { Banner };
