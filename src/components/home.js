import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';
// import { LitElement, html } from 'https://unpkg.com/lit-element@2.3.1/lit-element.js?module';

class Home extends LitElement {
  render() {
    return html`
    <h1>Home</h1>
    <p>
      <button type="button" @click="${() => this.dispatch({ type: 'navigate.team' })}">
        Go to team page
      </button>
    </p>
    `;
  }
}

export { Home };
