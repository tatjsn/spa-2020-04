import { store } from './store.js';
import { Module, ModuleDepot } from './moduleDepot.js';
import { createBrowserHistory } from 'https://unpkg.com/@tatjsn/esm@1.3.9/dist/history.js';


const moduleDepot = new ModuleDepot(store);
moduleDepot.add({
  'app-home': class extends Module {
    async setupElement() {
      const { Home } = await import('./components/home.js');
      return Home;
    }
  },
  'app-team': class extends Module {
    async setupElement() {
      const { Team } = await import('./components/team.js');
      return Team;
    }
    async fetchData(state, dispatch) {
      const { getAllMembers } = await import('./services/dataAccess.js');
      dispatch({
        type: 'store.team',
        payload: await getAllMembers(),
      });
    }
    select(state) {
      return { members: state.team };
    }
  },
  'app-member': class extends Module {
    async setupElement() {
      const { Member } = await import('./components/member.js');
      return Member;
    }
    async fetchData(state, dispatch) {
      const { getMemberById } = await import('./services/dataAccess.js');
      dispatch({
        type: 'store.member',
        payload: await getMemberById(state.viewArg),
      });
    }
    select(state) {
      const baseModel = state.team[state.viewArg];
      const isFavourite = state.favourites.includes(baseModel.id);
      return { ...baseModel, isFavourite };
    }
  },
  'app-banner': class extends Module {
    async setupElement() {
      const { Banner } = await import('./components/banner.js');
      return Banner;
    }
  },
  'app-message': class extends Module {
    async setupElement() {
      const { Message } = await import('./components/message.js');
      return Message;
    }
    select(state) {
      return { text: state.favourites.map(id => state.team[id].name).join() };
    }
  },
});

const appRoot = document.getElementById('app');
appRoot.addEventListener('action', (event) => {
  store.dispatch(event.detail);
});

const history = createBrowserHistory();

function getViewFromLocation(location) {
  const paths = location.pathname.split('/');
  const view = paths[1] || 'home';
  const viewArg = paths[2] ? +paths[2] : null; // FIXME viewArg should not be a number
  return { view: `app-${view}`, viewArg };
}

store.subscribe(() => {
  moduleDepot.render(appRoot);
  const { view, viewArg } = store.getState();
  const { view: viewFromHistory, viewArg: viewArgFromHistory } = getViewFromLocation(history.location);
  if (view !== viewFromHistory || viewArg !== viewArgFromHistory) {
    const path = view === 'app-home' ? '' : view.slice(4);
    const pathWithArg = viewArg ? `${path}/${viewArg}` : path;
    history.push(`/${pathWithArg}`);
  }
});

history.listen((location) => {
  const { view, viewArg } = store.getState();
  const { view: viewFromHistory, viewArg: viewArgFromHistory } = getViewFromLocation(location);
  if (view !== viewFromHistory || viewArg !== viewArgFromHistory) {
    store.dispatch({ type: `navigate.${viewFromHistory.slice(4)}`, payload: viewArgFromHistory });
  }
});

const { view, viewArg } = getViewFromLocation(history.location);
store.dispatch({ type: `navigate.${view.slice(4)}`, payload: viewArg });
