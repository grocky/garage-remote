const fs = require('fs');
const log = require('../logger')(module);

class StateManager {
  /**
   * @param {String} filename The filename for state storage
   */
  constructor(filename) {
    this.stateFile = filename;
    this.state = {};
  }

  /**
   * @param {Object} state
   */
  updateState(state) {
    this.state = { ...this.state, ...state };
  }

  /**
   * @return {Promise<>}
   */
  storeState() {
    return new Promise((res, rej) => {
      const data = JSON.stringify(this.state);
      fs.writeFile(this.stateFile, data, err => {
        if (err) {
          log('Failed writing state', err.message);
          rej(err);
        }
        res();
      })
    });
  }

  /**
   * @return {Promise<Object|null>}
   */
  async loadState() {
    if (this.state) {
      return Promise.resolve(this.state);
    }

    log('Loading state from file', this.stateFile);
    return new Promise((res, rej) => {
      fs.readFile(this.stateFile, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          log('Failed loading state', err.message);
          return this.storeState();
        }
        log('loadState readFile', data);
        const state = JSON.parse(data);
        this.state = state;
        res(state);
      })
    });
  }
}

StateManager.middleware = (stateManager) =>
  async (req, res, next) => {
    try {
      req.app.state = await stateManager.loadState();
    } catch (err) {
      log(err.message);
      req.app.state = {};
    }
    next();
  };

module.exports = StateManager;
