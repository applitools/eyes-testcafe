'use strict';
const {Logger} = require('@applitools/eyes-common');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');

class EyesBase {
  constructor() {
    this._logger = new Logger(true, 'eyes-testcafe');
    this._client = makeVisualGridClient({showLogs: true});
  }
  eyesOpen() {}
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
