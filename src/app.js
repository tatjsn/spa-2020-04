import { createStore, combineReducers } from 'https://unpkg.com/redux@4.0.5/es/redux.mjs';
import { getAllMembers, getMemberById } from './services/team.js';

function view(state = 'home', action) {
  switch (action.type) {
    case 'navigate.home':
      return 'home';
    case 'navigate.team':
      return 'team';
    default:
      return state;
  }
}

function team(state = [], action) {
  switch (action.type) {
    case 'store.team':
      return action.payload;
    default:
      return state;
  }
}

window.store = createStore(combineReducers({ view, team }));

async function render() {
  const { view } = window.store.getState();
  if (view == 'home' && !customElements.get('app-home')) {
    const { Home } = await import('./components/home.js');
    customElements.define('app-home', Home);
  } else if (view == 'team' && !customElements.get('app-team')) {
    const { Team } = await import('./components/team.js');
    customElements.define('app-team', Team);
    import('./services/team.js')
      .then(async ({ getAllMembers }) => {
        window.store.dispatch({
          type: 'store.team',
          payload: await getAllMembers(),
        });
      });
  }
  const element = document.createElement(`app-${view}`);
  element.model = window.store.getState()[view];
  const appRoot = document.getElementById('app');
  while (appRoot.firstChild) {
    appRoot.removeChild(appRoot.firstChild);
  }
  appRoot.appendChild(element);
}

window.store.subscribe(render);

render();
