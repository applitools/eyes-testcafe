'use strict';

const {ConfigUtils, Logger} = require('@applitools/eyes-common');
const {
  makeVisualGridClient,
  configParams: visualGridConfigParams,
} = require('@applitools/visual-grid-client');
const {TypeUtils} = require('@applitools/eyes-common');
const {TestResults} = require('@applitools/eyes-sdk-core');
const processPageAndSerialize = require('../dist/processPageAndSerialize');
const {version: packageVersion} = require('../package.json');
const blobsToResourceContents = require('./blobsToResourceContents');
const blobsToBuffer = require('./blobsToBuffer');
const getProxyUrl = require('./getProxyUrl');
const collectFrameData = require('./collectFrameData');
const makeMapProxyUrls = require('./makeMapProxyUrls');
const makeClientFunctionWrapper = require('./makeClientFunctionWrapper');

class Eyes {
  constructor() {
    this._defaultConfig = this._initDefaultConfig();
    this._logger = new Logger(this._defaultConfig.showLogs, 'eyes');
    this._apiLogger = this._logger.extend('api');
    this._logger.log('[constructor] initial config', this._defaultConfig);

    this._client = makeVisualGridClient({
      logger: this._logger.extend('vgc'),
      ...this._defaultConfig,
    });
    this._currentBatch = null;
    this._closedBatches = [];

    this._clientFunctionWrapper = makeClientFunctionWrapper({
      logger: this._logger.extend('clientFunctionWrapper'),
    });
    this._mapProxyUrls = makeMapProxyUrls({
      collectFrameData,
      getProxyUrl,
      logger: this._logger.extend('mapProxyUrls'),
    });
  }

  async open(args) {
    this._apiLogger.log('[open] called by user');
    await this._assertClosed('open');
    this._currentBatch = await this._openBatch(args);
  }

  async close() {
    this._apiLogger.log('[close] called by user');
    if (this._shouldIgnore('close')) {
      return;
    }
    this._closeBatch();
    this._closedBatches.push(this._currentBatch);
    this._currentBatch = null;
    return Promise.resolve();
  }

  async checkWindow(args) {
    this._apiLogger.log('[checkWindow] called by user');
    if (this._shouldIgnore('checkWindow')) {
      return;
    }

    let result = await this._processPage();
    blobsToBuffer(result);
    this._mapProxyUrls(result);
    blobsToResourceContents(result);

    this._logger.log(
      `[checkWindow] checking for test '${this._currentTestName()}' with ${JSON.stringify(args)}`,
    );
    return this._currentBatch.eyes.checkWindow({...result, ...args});
  }

  async waitForResults(rejectOnErrors = true) {
    // TODO - name of rejectOnErrors
    // TOOD add readme
    this._apiLogger.log('[waitForResults] called by user');
    await this._assertClosed('waitForResults');
    let batchesResults = await Promise.all(this._closedBatches.map(b => b.closePromise));
    batchesResults = batchesResults.map(this._removeTestResultsIfError);
    const settle =
      rejectOnErrors && this._shouldRejectBatches(batchesResults)
        ? Promise.reject.bind(Promise)
        : Promise.resolve.bind(Promise);
    return settle(batchesResults);
  }

  async _processPage() {
    // TODO - processPageAndSeralze should get a css mapper so
    // the proxy fix can be done while downloading the resources
    if (!this._processPageClientFunction) {
      this._processPageClientFunction = await this._clientFunctionWrapper(processPageAndSerialize);
    }
    return await this._processPageClientFunction();
  }

  async _openBatch(args) {
    // TOOD validate args like testName
    this._assertCanOpen();
    const batchInfo = this._initBatchInfo({
      isBatchStarted: true,
      isDisabled: this._defaultConfig['isDisabled'] || args.isDisabled,
      config: {...this._defaultConfig, ...args},
    });
    if (batchInfo.isDisabled) {
      this._logger.log('[_openBatch] skipping open since eyes is disabled');
      return;
    }
    // TODO - we can set testcafe viewport size here
    this._logger.log(`[_openBatch] opening with' ${JSON.stringify(batchInfo.config)}`);
    batchInfo.eyes = await this._client.openEyes(batchInfo.config);
    return batchInfo;
  }

  async _assertClosed(functionName) {
    if (this._currentBatch) {
      this._logger.log(
        `[${functionName}] test '${this._currentTestName()}' is not closed, closing it first.`,
      );
      await this.close();
    }
  }

  _currentTestName() {
    return this._currentBatch && this._currentBatch.config.testName;
  }

  _assertCanOpen(args) {
    if (this._defaultConfig['eyesIsDisabled'] && args.isDisabled === false) {
      throw new Error(
        `Eyes is globaly disabled (via APPLITOOLS_IS_DISABLED or with applitools.config.js), ` +
          `but the test was set with isDisabled false. ` +
          `A test cannot be enabled when Eyes is disabled globaly. ` +
          `Please enable the test or enable Eyes globaly.`,
      );
    }
  }

  _shouldRejectBatches(batchesResults) {
    return batchesResults.some(batchResult =>
      batchResult.some(r => !(r instanceof TestResults) || r.getStatus() !== 'Passed'),
    );
  }

  _removeTestResultsIfError(batchResult) {
    const e = batchResult.find(r => !(r instanceof TestResults));
    return e ? [e] : batchResult;
  }

  _closeBatch() {
    if (!this._currentBatch) {
      return this._logger.log('[_closeBatch] closed when no current test, ignoreing.');
    }
    const closePromise = this._currentBatch.eyes.close(false);
    this._currentBatch.closePromise = closePromise;
  }

  _shouldIgnore(methodName) {
    if (!this._currentBatch) {
      this._logger.log(`[${methodName}] closed when no current test, ignoring.`);
      return true;
    }
    if (this._currentBatch.isDisabled) {
      this._logger.log(`[${methodName}] eyes is disabled, ignoring.`);
      return true;
    }
  }

  _initBatchInfo(info) {
    return {
      ...{
        isBatchStarted: false,
        isDisabled: false,
        config: null,
        eyes: null,
        closePromise: null,
      },
      ...info,
    };
  }

  // TODO - take what u can to another file for tests
  _initDefaultConfig() {
    // TODO - config params
    const testcafeConfigParams = [
      /* 'tapDirPath', 'failTestcafeOnDiff' */
    ];
    // TODO add 'eyesTimeout' to configParams ? like cypress wait for end dont we have this in VGC ?
    const calculatedConfig = ConfigUtils.getConfig({
      configParams: [...visualGridConfigParams, ...testcafeConfigParams],
    });
    const defaultConfig = {agentId: `eyes-testcafe/${packageVersion}`}; // TODO - concurrency ok ?
    const configResult = {...defaultConfig, ...calculatedConfig};
    if (configResult.failTestcafeOnDiff === '0') {
      configResult.failTestcafeOnDiff = false;
    }
    if (TypeUtils.isString(configResult.showLogs)) {
      configResult.showLogs = configResult.showLogs === 'true' || configResult.showLogs === '1';
    }
    return configResult;
  }
}

module.exports = Eyes;
