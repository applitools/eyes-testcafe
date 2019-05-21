'use strict';

const {t} = require('testcafe');
const {Logger} = require('@applitools/eyes-common');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');
const {ArgumentGuard} = require('@applitools/eyes-common');
const {TestResults} = require('@applitools/eyes-sdk-core');
const processPageAndSerialize = require('../dist/processPageAndSerialize');
const blobsToResourceContents = require('./blobsToResourceContents');
const blobsToBuffer = require('./blobsToBuffer');
const getProxyUrl = require('./getProxyUrl');
const collectFrameData = require('./collectFrameData');
const makeMapProxyUrls = require('./makeMapProxyUrls');
const makeClientFunctionWrapper = require('./makeClientFunctionWrapper');
const makeHandleResizeTestcafe = require('./makeHandleResizeTestcafe');
const initDefaultConfig = require('./initDefaultConfig');
const DEFAULT_VIEWPORT = {width: 1024, height: 768};

class Eyes {
  constructor() {
    this._defaultConfig = initDefaultConfig();
    this._logger = new Logger(this._defaultConfig.showLogs, 'eyes');
    this._logger.log('[constructor] initial config', this._defaultConfig);

    this._client = makeVisualGridClient({
      logger: this._logger.extend('vgc'),
      ...this._defaultConfig,
    });
    this._currentBatch = null;
    this._closedBatches = [];
    this._makeFunctions();
  }

  async open(args) {
    this._logger.log('[open] called by user');
    await this._assertClosed('open');
    this._currentBatch = await this._openBatch(args);
  }

  async close() {
    this._logger.log('[close] called by user');
    if (this._shouldIgnore('close')) {
      return;
    }
    this._closeBatch();
    this._closedBatches.push(this._currentBatch);
    this._currentBatch = null;
    return Promise.resolve();
  }

  async checkWindow(args) {
    this._logger.log('[checkWindow] called by user');
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
    this._logger.log('[waitForResults] called by user');
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
    if (!this._processPageClientFunction) {
      this._processPageClientFunction = await this._clientFunctionWrapper(processPageAndSerialize);
    }
    return await this._processPageClientFunction();
  }

  async _openBatch(args) {
    this._assertCanOpen(args);
    const batchInfo = this._initBatchInfo({
      isBatchStarted: true,
      isDisabled: this._defaultConfig['isDisabled'] || args.isDisabled,
      config: {...this._defaultConfig, ...args},
    });
    if (batchInfo.isDisabled) {
      this._logger.log('[_openBatch] skipping open since eyes is disabled');
      return;
    }

    await this._handleResizeTestcafe(args.browser);
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

  _makeFunctions() {
    this._clientFunctionWrapper = makeClientFunctionWrapper({
      logger: this._logger.extend('clientFunctionWrapper'),
    });
    this._mapProxyUrls = makeMapProxyUrls({
      collectFrameData,
      getProxyUrl,
      logger: this._logger.extend('mapProxyUrls'),
    });
    this._handleResizeTestcafe = makeHandleResizeTestcafe({
      defaultViewport: DEFAULT_VIEWPORT,
      logger: this._logger.extend('handleResizeTestcafe'),
      t,
    });
  }

  _currentTestName() {
    return this._currentBatch && this._currentBatch.config.testName;
  }

  _assertCanOpen(args) {
    ArgumentGuard.isString(args.testName, 'testName', false);
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
}

module.exports = Eyes;
