'use strict';

class EyesBase {
  constructor() {
    this._client = makeVisualGridClient(Object.assign(extraConfig, config));
  }
  eyesOpen() {}
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
