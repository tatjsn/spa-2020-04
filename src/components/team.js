import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';
import { fromAction, fromRequire } from '../customEvents.js';

class Team extends LitElement {
  static get properties() {
    return {
      model: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(fromRequire('team', this));
  }

  render() {
    const members = Object.values(this.model.members);
    members.sort((a, b) => a.id - b.id);
    return html`
    <h1>Team</h1>
    <ul>
      ${members.map(member => html`
        <li>
          <button
            type="button"
            @click="${() => this.dispatchEvent(fromAction({
              type: 'navigate.member',
              payload: member.id,
            }))}"
          >
            ${member.name}
          </button>
        </li>
      `)}
    </ul>
    <p>
      <button
        type="button"
        @click="${() => this.dispatchEvent(fromAction({ type: 'navigate.home' }))}"
      >
        Go to home page
      </button>
    </p>
    `;
  }
}

export { Team };
