'use strict';

class EyesBase {
  constructor() {
    const client = makeVisualGridClient(Object.assign(extraConfig, config));
  }
  eyesOpen() {}
  checkWindow() {}
  close() {}
}

module.exports = EyesBase;
