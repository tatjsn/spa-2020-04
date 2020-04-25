import { createStore, combineReducers } from 'https://unpkg.com/redux@4.0.5/es/redux.mjs';

function view(state = null, action) {
  switch (action.type) {
    case 'navigate.home':
      return 'app-home';
    case 'navigate.team':
      return 'app-team';
    case 'navigate.member':
      return 'app-member';
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

function favourites(state = [], action) {
  switch (action.type) {
    case 'favourites.add':
      return [...state, action.payload];
    case 'favourites.remove':
      const result = [];
      for (const item of state) {
        if (item !== action.payload) {
          result.push(item);
        }
      }
      return result;
    default:
      return state;
  }
}

export const store = createStore(combineReducers({ view, viewArg, team, favourites }));
