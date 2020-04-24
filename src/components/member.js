import { LitElement, html } from 'https://unpkg.com/@tatjsn/esm@1.3.8/dist/lit-element.js';
import { fromAction } from '../customEvents.js';

class Member extends LitElement {
  static get properties() {
    return {
      model: { type: Object },
    };
  }

  constructor() {
    super();
    this.model = {};
  }

  didFavouriteChange(event) {
    const type = event.target.checked? 'favourites.add' : 'favourites.remove';
    this.dispatchEvent(fromAction({ type, payload: this.model.id }));
  }

  render() {
    return html`
    <p style="float:right">
      <img src="${this.model.image}" width="320">
    </p>
    <h1>${this.model.name}</h1>
    <h2>Class: ${this.model.class}</h2>
    <p>
      <input type="checkbox" id="checkbox" ?checked="${this.model.isFavourite}", @change="${this.didFavouriteChange}">
      <label for="checkbox">Favourite</label>
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
