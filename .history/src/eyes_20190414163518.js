'use strict';
const makeVisualGridClient = require('@applitools/visual-grid-client');

class EyesBase {
  constructor() {
    this._client = makeVisualGridClient({showLogs: true, 'eyes-'});
  }
  eyesOpen() {}
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
