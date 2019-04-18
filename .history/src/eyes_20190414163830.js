'use strict';
const {Logger} = require('@applitools/eyes-common');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');

class EyesBase {
  constructor() {
    this._logger = new Logger(false, 'eyes-testcafe');
    this._client = makeVisualGridClient({showLogs: true, logger: this._logger});
  }
  eyesOpen() {}
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
