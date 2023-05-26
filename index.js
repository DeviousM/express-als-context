'use strict';

const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function middleware(req, res, next) {
  asyncLocalStorage.run(new Map(), () => {
    next();
  });
}

/**
 * Gets a value from the context by key.  Will return undefined if the context has not yet been initialized for this request or if a value is not found for the specified key.
 * @param {string} key
 */
function get(key) {
  const store = asyncLocalStorage.getStore();
  if (store) {
    return store.get(key);
  }
}

/**
 * Adds a value to the context by key.  If the key already exists, its value will be overwritten.  No value will persist if the context has not yet been initialized.
 * @param {string} key
 * @param {*} value
 */
function set(key, value) {
  const store = asyncLocalStorage.getStore();
  if (store) {
    return store.set(key, value);
  }
}

module.exports = {
  middleware,
  get: get,
  set: set,
};
