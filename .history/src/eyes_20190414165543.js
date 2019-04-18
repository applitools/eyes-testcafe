'use strict';
const {Logger} = require('@applitools/eyes-common');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');
const {version: packageVersion} = require('../package.json');
const {getProcessPageScript} = require('@applitools/dom-snapshot');
import {ClientFunction} from 'testcafe';
const agentId = ;

class EyesBase {
  constructor() {
    this._config = {`eyes-testcafe/${packageVersion}`};
    this._logger = new Logger(this._config.showLogs, 'eyes-testcafe');
    const clientConfig = {logger: this._logger, ...this._config};
    this._client = makeVisualGridClient(clientConfig);
  }

  eyesOpen(config) {
    return this._client.openEyes(config);
  }

  checkWindow() {}

  close() {}
}

module.exports = EyesBase;
