import { store } from './store.js';
import { Module, ModuleDepot } from './moduleDepot.js';

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

const wrappedRender = () => moduleDepot.render(appRoot);
store.subscribe(wrappedRender);

wrappedRender();
