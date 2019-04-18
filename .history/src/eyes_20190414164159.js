'use strict';
const {Logger} = require('@applitools/eyes-common');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');
const {version: packageVersion} = require('../package.json');
const agentId = `eyes-testcafe/${packageVersion}`;

class EyesBase {
  constructor() {
    this._confgi = {};
    this._logger = new Logger(false, 'eyes-testcafe');
    this._client = makeVisualGridClient({showLogs: true, logger: this._logger});
  }
  eyesOpen(config) {
    return this._client.openEyes(config);
  }
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
