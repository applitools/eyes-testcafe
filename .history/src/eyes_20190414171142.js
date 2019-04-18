'use strict';
import {ClientFunction} from 'testcafe';
const {Logger} = require('@applitools/eyes-common');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');
const {
  processPageAndSerialize,
} = require('@applitools/dom-snapshot/src/browser/processPageAndSerialize');
const {version: packageVersion} = require('../package.json');

class EyesBase {
  constructor() {
    this._config = {agentId: `eyes-testcafe/${packageVersion}`};
    this._logger = new Logger(this._config.showLogs, 'eyes-testcafe');
    const clientConfig = {logger: this._logger, ...this._config};
    this._client = makeVisualGridClient(clientConfig);
    this._processPage = ClientFunction(processPageAndSerialize, {dependencies: {}});
  }

  async eyesOpen(config) {
    return this._client.openEyes(config);
  }

  async checkWindow() {
    const res = await this._processPage();
  }

  close() {}
}

module.exports = EyesBase;
