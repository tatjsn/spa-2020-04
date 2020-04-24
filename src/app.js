import { store } from './store.js';
import { Module, ModuleStore } from './module.js';

const moduleStore = new ModuleStore(store);
moduleStore.add({
  home: class extends Module {
    async setupElement() {
      const { Home } = await import('./components/home.js');
      return ['app-home', Home];
    }
  },
  team: class extends Module {
    async setupElement() {
      const { Team } = await import('./components/team.js');
      return ['app-team', this.connect(Team, true)];
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
  member: class extends Module {
    async setupElement() {
      const { Member } = await import('./components/member.js');
      return ['app-member', this.connect(Member, true)];
    }
    async fetchData(state, dispatch) {
      const { getMemberById } = await import('./services/dataAccess.js');
      dispatch({
        type: 'store.member',
        payload: await getMemberById(state.viewArg),
      });
    }
    select(state) {
      return state.team[state.viewArg];
    }
  },
  banner: class extends Module {
    async setupElement() {
      const { Banner } = await import('./components/banner.js');
      return ['app-banner', Banner];
    }
  },
  message: class extends Module {
    async setupElement() {
      const { Message } = await import('./components/message.js');
      return ['app-message', this.connect(Message)];
    }
    select(state) {
      return state.message;
    }
  },
});

const appRoot = document.getElementById('app');
const wrappedRender = () => moduleStore.render(appRoot);
appRoot.addEventListener('action', (event) => {
  store.dispatch(event.detail);
});

store.subscribe(wrappedRender);

wrappedRender();
