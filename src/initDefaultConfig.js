'use strict';

const {version: packageVersion} = require('../package.json');
const {ConfigUtils} = require('@applitools/eyes-common');
const {configParams: visualGridConfigParams} = require('@applitools/visual-grid-client');
const {TypeUtils} = require('@applitools/eyes-common');

function initDefaultConfig(configPath = undefined) {
  const testcafeConfigParams = ['tapDirPath', 'failTestcafeOnDiff'];
  const calculatedConfig = ConfigUtils.getConfig({
    configParams: [...visualGridConfigParams, ...testcafeConfigParams],
    configPath,
  });
  const defaultConfig = {
    agentId: `eyes-testcafe/${packageVersion}`,
    failTestcafeOnDiff: true,
    concurrency: 1,
  };
  const configResult = {...defaultConfig, ...calculatedConfig};
  if (configResult.failTestcafeOnDiff === '0') {
    configResult.failTestcafeOnDiff = false;
  }
  if (TypeUtils.isString(configResult.showLogs)) {
    configResult.showLogs = configResult.showLogs === 'true' || configResult.showLogs === '1';
  }
  return configResult;
}

module.exports = initDefaultConfig;
