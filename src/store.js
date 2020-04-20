import { createStore, combineReducers } from 'https://unpkg.com/redux@4.0.5/es/redux.mjs';

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

function banner(state = { text: 'Banner Text' }) {
  return state;
}

export const store = createStore(combineReducers({ view, viewArg, team, banner }));
