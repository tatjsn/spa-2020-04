import { store } from './store.js';
import { render } from './render.js';

function connect(Classe, useFetch = false) {
  const savedCC = Classe.prototype.connectedCallback;
  Classe.prototype.connectedCallback = function() {
    savedCC.call(this);
    const render = () => {
      this.model = modules[Classe.name.toLowerCase()].select(store.getState());
    };
    this.unsubscribe = store.subscribe(render);
    render();
    if (useFetch) {
      modules[Classe.name.toLowerCase()].fetchData(store.getState(), store.dispatch);
    }
  };
  const savedDC = Classe.prototype.disconnectedCallback;
  Classe.prototype.disconnectedCallback = function() {
    savedDC.call(this);
    this.unsubscribe();
  }
}

function setupDependencies(Classe) {
  if (!Classe.dependencies) {
    return;
  }
  for (const dep of Classe.dependencies) {
    const name = dep.slice(4);
    modules[name].setupElement();
  }
}

const modules = {
  home: {
    setupElement: async () => {
      console.log('setup home');
      const { Home } = await import('./components/home.js');
      customElements.define('app-home', Home);
      setupDependencies(Home);
    },
    fetchData: () => {},
    select: () => ({}),
  },
  team: {
    setupElement: async () => {
      const { Team } = await import('./components/team.js');
      connect(Team, true);
      customElements.define('app-team', Team);
      setupDependencies(Team);
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
      connect(Member, true);
      customElements.define('app-member', Member); 
      setupDependencies(Member);
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
      setupDependencies(Banner);
    },
    fetchData: () => {},
    select: () => ({}),
  },
  message: {
    setupElement: async () => {
      console.log('setup message');
      const { Message } = await import('./components/message.js');
      connect(Message);
      customElements.define('app-message', Message);  
      setupDependencies(Message);
    },
    fetchData: () => {},
    select: state => state.message,
  },
}

const appRoot = document.getElementById('app');
const wrappedRender = () => render(appRoot, modules, store.getState());
appRoot.addEventListener('action', (event) => {
  store.dispatch(event.detail);
});

store.subscribe(wrappedRender);

wrappedRender();
