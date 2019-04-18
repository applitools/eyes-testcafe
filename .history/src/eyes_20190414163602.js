'use strict';
const Logger = require()
const makeVisualGridClient = require('@applitools/visual-grid-client');

class EyesBase {
  constructor() {
    this._client = makeVisualGridClient({showLogs: true, 'eyes-testcafe'});
  }
  eyesOpen() {}
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
