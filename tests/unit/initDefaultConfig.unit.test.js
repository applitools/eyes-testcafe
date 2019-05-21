'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const initDefaultConfig = require('../../src/initDefaultConfig');
const path = require('path');

describe('initDefaultConfig', () => {
  it('works', () => {
    const configPath = path.resolve(__dirname, './applitools.config.js');
    process.env.APPLITOOLS_API_KEY = 'OVERIDEN!!!';
    process.env.APPLITOOLS_TAP_DIR_PATH = 'SOME PATH';
    const config = initDefaultConfig(configPath);
    expect(config).to.eql({
      agentId: 'eyes-testcafe/1.0.0',
      apiKey: 'OVERIDEN!!!',
      isDisabled: false,
      showLogs: true,
      someKey: 'someValue',
      tapDirPath: 'SOME PATH',
    });
  });
});
