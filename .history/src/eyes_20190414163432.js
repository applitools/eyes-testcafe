'use strict';
const makeVisualGridClient = require('@applitools/visual-grid-client')
class EyesBase {
  constructor() {
    this._client = makeVisualGridClient(Object.assign(extraConfig, config));
  }
  eyesOpen() {}
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
