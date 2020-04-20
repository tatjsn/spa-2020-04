import { store } from './store.js';
import { render } from './render.js';

const modules = {
  home: {
    setupElement: async () => {
      const { Home } = await import('./components/home.js');
      customElements.define('app-home', Home);  
    },
    fetchData: () => {},
    select: () => ({}),
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
    select: state => ({ members: state.team }),
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
const wrappedRender = () => render(appRoot, modules, store.getState());
appRoot.addEventListener('action', (event) => {
  store.dispatch(event.detail);
});
appRoot.addEventListener('require', (event) => {
  if (event.detail.startsWith('app-')) {
    const view = event.detail.slice(4);
    if (!customElements.get(event.detail)) {
      modules[view].setupElement();
    }
    const parentView = event.target.tagName.toLowerCase().slice(4);
    if (!modules[parentView].registeredDeps) {
      modules[parentView].registeredDeps = [];
    }
    if (!modules[parentView].registeredDeps.includes(view)) {
      const prevParentSelect = modules[parentView].select;
      modules[parentView].select = (state) => {
        const st = prevParentSelect(state);
        if (!st.deps) {
          st.deps = {};
        }
        st.deps[view] = modules[view].select(state);
        return st;
      };
      wrappedRender(); // To make new selector effective
      modules[parentView].registeredDeps.push(view);
    }
    return;  
  }
  modules[event.detail].fetchData(store.getState(), store.dispatch);
});

store.subscribe(wrappedRender);

wrappedRender();
