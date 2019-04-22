'use strict';
const fs = require('fs');
const {promisify} = require('util');
const {Logger} = require('@applitools/eyes-common');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');
const {version: packageVersion} = require('../package.json');
const processPageAndSerialize = require('../dist/processPageAndSerialize');
const clientFunctionExecutor = require('./clientFunctionExecutor');
const writeFile = promisify(fs.writeFile);

class Eyes {
  constructor() {
    this._config = {agentId: `eyes-testcafe/${packageVersion}`};
    this._logger = new Logger(this._config.showLogs, 'eyes-testcafe');
    const clientConfig = {logger: this._logger, ...this._config};
    clientConfig.apiKey = 'xHXr731030WHHgsnLujyAyH7gdVreHX1vz8lPLQHEoLFI110';
    this._client = makeVisualGridClient(clientConfig);
  }

  async eyesOpen(config) {
    return this._client.openEyes(config);
  }

  async checkWindow({saveCdt}) {
    const result = await this._processPage();
    if (saveCdt) {
      await writeFile(`./cdt.json`, JSON.stringify(result, null, 2));
    }
  }

  async _processPage() {
    if (!this._processPageClientFunction) {
      this._processPageClientFunction = await clientFunctionExecutor({
        clientFunction: processPageAndSerialize,
      });
    }
    return await this._processPageClientFunction();
  }

  close() {}
}

module.exports = Eyes;
