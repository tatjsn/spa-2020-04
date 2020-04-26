import { store } from './store.js';
import { Byu, withRedux } from './byu.js';
import { openDB } from 'https://unpkg.com/idb@5.0.2/build/esm/index.js?module';

const byu = new Byu();
byu.register(withRedux(store, {
  'app-home': {
    async setupElement() {
      const { Home } = await import('./components/home.js');
      return Home;
    }
  },
  'app-team': {
    async setupElement() {
      const { Team } = await import('./components/team.js');
      return Team;
    },
    async fetchData(state, dispatch) {
      const { getAllMembers } = await import('./services/dataAccess.js');
      dispatch({
        type: 'store.team',
        payload: await getAllMembers(),
      });
    },
    select(state) {
      return { members: state.team };
    },
  },
  'app-member': {
    async setupElement() {
      const { Member } = await import('./components/member.js');
      return Member;
    },
    async fetchData(state, dispatch) {
      const { getMemberById } = await import('./services/dataAccess.js');
      dispatch({
        type: 'store.member',
        payload: await getMemberById(state.viewArg),
      });
    },
    select(state) {
      const baseModel = state.team[state.viewArg];
      const isFavourite = state.favourites.includes(baseModel.id);
      return { ...baseModel, isFavourite };
    },
  },
  'app-banner': {
    async setupElement() {
      const { Banner } = await import('./components/banner.js');
      return Banner;
    },
  },
  'app-message': {
    async setupElement() {
      const { Message } = await import('./components/message.js');
      return Message;
    },
    select(state) {
      return { text: state.favourites.map(id => state.team[id].name).join() };
    },
  },
}));

const appRoot = document.getElementById('app');
appRoot.addEventListener('action', (event) => {
  store.dispatch(event.detail);
});
store.subscribe(() => byu.render(appRoot, store.getState().view));

async function boot() {
  const db = await openDB('app-db', 1, {
    upgrade(db, oldVersion) {
      switch (oldVersion) {
        case 0:
          const store = db.createObjectStore('state', {keyPath: 'id'});
          store.add({ id: 1, view: 'app-home', viewArg: null });
      }
    },
  });

  const { view, viewArg } = await db.get('state', 1);
  store.dispatch({ type: `navigate.${view.slice(4)}`, payload: viewArg });

  store.subscribe(async () => {
    const { view, viewArg } = store.getState();
    const { view: viewFromDb, viewArg: viewArgFromDb } = await db.get('state', 1);
    if (view !== viewFromDb || viewArg != viewArgFromDb) {
      db.put('state', { id: 1, view, viewArg });
    }
  });
}

boot();
