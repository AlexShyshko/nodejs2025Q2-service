import { DB } from '../types-and-interfaces';

const db: DB = {
  users: {},
  artists: {},
  albums: {},
  tracks: {},
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};

export { db };
