import { createStore, combineReducers } from 'https://unpkg.com/redux@4.0.5/es/redux.mjs';
import { getAllMembers, getMemberById } from './services/team.js';

function view(state = 'home', action) {
  switch (action.type) {
    case 'navigate.home':
      return 'home';
    case 'navigate.team':
      return 'team';
    case 'navigate.member':
      return 'member';
    default:
      return state;
  }
}

function viewArg(state = null, action) {
  switch (action.type) {
    case 'navigate.home':
      return null;
    case 'navigate.team':
      return null;
    case 'navigate.member':
      return action.payload;
    default:
      return state;
  }
}

function team(state = {}, action) {
  switch (action.type) {
    case 'store.team':
      return Object.assign({}, ...action.payload.map(item => ({ [item.id]: item })));
    case 'store.member':
      return {...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
}

window.store = createStore(combineReducers({ view, viewArg, team }));

async function render() {
  const { view, viewArg, team } = window.store.getState();

  // Ideally these codes should be auto-generated
  if (view == 'home' && !customElements.get('app-home')) {
    const { Home } = await import('./components/home.js');
    customElements.define('app-home', Home);
  } else if (view == 'team' && !customElements.get('app-team')) {
    const { Team } = await import('./components/team.js');
    customElements.define('app-team', Team);
  } else if (view == 'member' && !customElements.get('app-member')) {
    const { Member } = await import('./components/member.js');
    customElements.define('app-member', Member);
  }

  const appRoot = document.getElementById('app');
  const prevView = appRoot.firstChild;

  if (view == 'team' && prevView.tagName.toLowerCase() !== 'app-team') {
    import('./services/team.js')
      .then(async ({ getAllMembers }) => {
        window.store.dispatch({
          type: 'store.team',
          payload: await getAllMembers(),
        });
      });
  } else if (view == 'member' && prevView.tagName.toLowerCase() !== 'app-member') {
    import('./services/team.js')
      .then(async ({ getMemberById }) => {
        window.store.dispatch({
          type: 'store.member',
          payload: await getMemberById(viewArg),
        });
      });
  }

  const element = document.createElement(`app-${view}`);
  if (view == 'team') {
    element.model = team;
  } else if (view == 'member') {
    element.model = team[viewArg];
  }

  while (appRoot.firstChild) {
    appRoot.removeChild(appRoot.firstChild);
  }
  appRoot.appendChild(element);
}

window.store.subscribe(render);

render();
