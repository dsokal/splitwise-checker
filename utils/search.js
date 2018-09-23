import Fuse from 'fuse.js';

const options = {
  tokenize: true,
  threshold: 0.3,
  location: 0,
  distance: 80,
  maxPatternLength: 32,
  minMatchCharLength: 1,
};

export default function createSearch(list, keys) {
  return new Fuse(list, { ...options, keys });
}
