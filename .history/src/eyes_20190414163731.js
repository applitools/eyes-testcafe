'use strict';
const {Logger} = require('@applitools/eyes-common')
const {makeVisualGridClient} = require('@applitools/visual-grid-client');

class EyesBase {
  constructor() {
      this._logger = new Lo
    this._client = makeVisualGridClient({showLogs: true, 'eyes-testcafe'});
  }
  eyesOpen() {}
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
