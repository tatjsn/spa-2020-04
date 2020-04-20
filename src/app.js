import { store } from './store.js';
import { render } from './render.js';

const modules = {
  home: {
    setupElement: async () => {
      const { Home } = await import('./components/home.js');
      customElements.define('app-home', Home);  
    },
    fetchData: () => 0,
    select: () => 0,
  },
  team: {
    setupElement: async () => {
      const { Team } = await import('./components/team.js');
      customElements.define('app-team', Team);
    },
    fetchData: async (state, dispatch) => {
      const { getAllMembers } = await import('./services/dataAccess.js');
      dispatch({
        type: 'store.team',
        payload: await getAllMembers(),
      });
    },
    select: state => state.team,
  },
  member: {
    setupElement: async () => {
      const { Member } = await import('./components/member.js');
      customElements.define('app-member', Member);  
    },
    fetchData: async (state, dispatch) => {
      const { getMemberById } = await import('./services/dataAccess.js');
      dispatch({
        type: 'store.member',
        payload: await getMemberById(state.viewArg),
      });
    },
    select: state => state.team[state.viewArg],
  },
  banner: {
    setupElement: async () => {
      const { Banner } = await import('./components/banner.js');
      customElements.define('app-banner', Banner);  
    },
    fetchData: () => {},
    select: state => state.banner,
  },
}

const appRoot = document.getElementById('app');
appRoot.addEventListener('action', (event) => {
  store.dispatch(event.detail);
});
appRoot.addEventListener('require', (event) => {
  if (event.detail.startsWith('app-')) {
    modules[event.detail.slice(4)].setupElement();
    return;  
  }
  modules[event.detail].fetchData(store.getState(), store.dispatch);
})
const wrappedRender = () => render(appRoot, modules, store.getState());

store.subscribe(wrappedRender);

wrappedRender();
