'use strict';

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
const handleBatchResultsFile = require('./handleBatchResultsFile');
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
    this._currentTest = null;
    this._closedTesst = [];
    this._makeFunctions();
  }

  async open(args) {
    this._logger.log('[open] called by user');
    this._assertCanOpen(args);
    await this._assertClosed('open');
    await this._handleResizeTestcafe(args.browser, args.t);
    this._currentTest = await this._openTest(args);
  }

  async close() {
    this._logger.log('[close] called by user');
    if (this._shouldIgnore('close')) {
      return;
    }
    this._closeTest();
    this._closedTesst.push(this._currentTest);
    this._currentTest = null;
    return Promise.resolve();
  }

  async checkWindow(args) {
    this._logger.log('[checkWindow] called by user');
    if (this._shouldIgnore('checkWindow')) {
      return;
    }

    let result = await this._processPage(this._currentTest.t);
    blobsToBuffer(result);
    this._mapProxyUrls(result);
    blobsToResourceContents(result);

    this._logger.log(
      `[checkWindow] checking for test '${this._currentTestName()}' with ${JSON.stringify(args)}`,
    );
    return this._currentTest.eyes.checkWindow({...result, ...args});
  }

  async waitForResults(rejectOnErrors = true) {
    this._logger.log('[waitForResults] called by user');
    await this._assertClosed('waitForResults');
    let results = await Promise.all(this._closedTesst.map(b => b.closePromise));
    results = results.map(this._removeTestResultsIfError);
    await handleBatchResultsFile({results, tapDirPath: this._defaultConfig.tapDirPath});

    const settle =
      rejectOnErrors && this._shouldRejectTests(results)
        ? Promise.reject.bind(Promise)
        : Promise.resolve.bind(Promise);
    return settle(results);
  }

  async _processPage(t) {
    if (!this._processPageClientFunction) {
      this._processPageClientFunction = await this._clientFunctionWrapper(processPageAndSerialize);
    }
    return await this._processPageClientFunction(t);
  }

  async _openTest(args) {
    const testInfo = this._initTestInfo({
      isTestStarted: true,
      isDisabled: this._defaultConfig.isDisabled || args.isDisabled,
      config: {...this._defaultConfig, ...args},
      t: args.t,
    });
    if (testInfo.isDisabled) {
      this._logger.log('[_openTest] skipping open since eyes is disabled');
      return;
    }

    const stringableConfig = {...testInfo.config};
    delete stringableConfig.t;
    this._logger.log(`[_openTest] opening with' ${JSON.stringify(stringableConfig)}`);
    testInfo.eyes = await this._client.openEyes(testInfo.config);
    return testInfo;
  }

  async _assertClosed(functionName) {
    if (this._currentTest) {
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
    });
  }

  _currentTestName() {
    return this._currentTest && this._currentTest.config.testName;
  }

  _assertCanOpen(args) {
    ArgumentGuard.isString(args.testName, 'testName', false);
    if (!args.t || !args.t.resizeWindow) {
      throw new Error('eyes.open() was called without test contorller "t".');
    }
    if (this._defaultConfig.eyesIsDisabled && args.isDisabled === false) {
      throw new Error(
        `Eyes is globaly disabled (via APPLITOOLS_IS_DISABLED or with applitools.config.js), ` +
          `but the test was set with isDisabled false. ` +
          `A test cannot be enabled when Eyes is disabled globaly. ` +
          `Please enable the test or enable Eyes globaly.`,
      );
    }
  }

  _shouldRejectTests(testsResults) {
    return (
      this._defaultConfig.failTestcafeOnDiff &&
      testsResults.some(testResult =>
        testResult.some(r => !(r instanceof TestResults) || r.getStatus() !== 'Passed'),
      )
    );
  }

  _removeTestResultsIfError(testResult) {
    const e = testResult.find(r => !(r instanceof TestResults));
    return e ? [e] : testResult;
  }

  _closeTest() {
    if (!this._currentTest) {
      return this._logger.log('[_closeTest] closed when no current test, ignoreing.');
    }
    const closePromise = this._currentTest.eyes.close(false);
    this._currentTest.closePromise = closePromise;
  }

  _shouldIgnore(methodName) {
    if (!this._currentTest) {
      this._logger.log(`[${methodName}] closed when no current test, ignoring.`);
      return true;
    }
    if (this._currentTest.isDisabled) {
      this._logger.log(`[${methodName}] eyes is disabled, ignoring.`);
      return true;
    }
  }

  _initTestInfo(info) {
    return {
      ...{
        isTestStarted: false,
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
