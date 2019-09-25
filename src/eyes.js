'use strict';

const {ArgumentGuard, Logger} = require('@applitools/eyes-common');
const {presult} = require('@applitools/functional-commons');
const {makeVisualGridClient} = require('@applitools/visual-grid-client');
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
const getUserAgent = require('./getUserAgent');
const printResults = require('./printResults');
const convertSelectors = require('./convertSelectors');
const DEFAULT_VIEWPORT = {width: 1024, height: 768};

class Eyes {
  constructor({configPath} = {}) {
    this._defaultConfig = initDefaultConfig(configPath);
    this._logger = new Logger(this._defaultConfig.showLogs, 'eyes');
    this._logger.log('[constructor] initial config', this._defaultConfig);

    this._client = makeVisualGridClient({
      logger: this._logger.extend('vgc'),
      ...this._defaultConfig,
    });
    this._currentTest = null;
    this._testcafeSize = {};
    this._closedTests = [];
    this._attacheFunctions();
  }

  async open(args) {
    this._logger.log('[open] called by user');
    this._currentTest = await this._openAndInitTest(args);
    if (this._shouldSkip('open')) {
      this._currentTest = null;
      return;
    }
    this._testcafeSize = await this._handleResizeTestcafe(args.browser, args.t, this._testcafeSize);
  }

  async close() {
    this._logger.log('[close] called by user');
    if (this._shouldSkip('close')) {
      return;
    }
    this._closeTest();
    this._closedTests.push(this._currentTest);
    this._currentTest = null;
  }

  async checkWindow(args) {
    this._logger.log('[checkWindow] called by user');
    if (this._shouldSkip('checkWindow')) {
      return;
    }

    let result = await this._processPage(this._currentTest.t);
    const referrer = result.referrer;
    blobsToBuffer(result);
    this._mapProxyUrls(result);
    blobsToResourceContents(result);

    await convertSelectors({
      args,
      t: this._currentTest.t,
      logger: this._logger.extend('convertSelectors'),
    });
    this._logger.log(
      `[checkWindow] checking for test '${this._currentTestName()}' with ${JSON.stringify(args)}`,
    );
    return this._currentTest.eyes.checkWindow({...result, ...args, referrer});
  }

  async waitForResults(rejectOnErrors = true) {
    this._logger.log('[waitForResults] called by user');
    await this._assertClosed('waitForResults');
    let results = await Promise.all(this._closedTests.map(b => b.closePromise));
    await this._handleCloseBatch();

    results = results.map(this._removeTestResultsIfError.bind(this));
    await handleBatchResultsFile({results, tapDirPath: this._defaultConfig.tapDirPath});

    const settle =
      rejectOnErrors && this._defaultConfig.failTestcafeOnDiff && this._containsFailure(results)
        ? Promise.reject.bind(Promise)
        : Promise.resolve.bind(Promise);

    printResults(results, this._defaultConfig.concurrency);
    return settle(results);
  }

  async _handleCloseBatch() {
    const [err] = await presult(this._client.closeBatch());
    if (err) {
      this._logger.log('failed to close batch', err);
    }
  }

  async _processPage(t) {
    if (!this._processPageClientFunction) {
      this._processPageClientFunction = await this._clientFunctionWrapper(processPageAndSerialize);
    }
    return await this._processPageClientFunction(t);
  }

  async _openAndInitTest(args) {
    const testInfo = this._initTestInfo({
      isTestStarted: true,
      isDisabled: this._defaultConfig.isDisabled || args.isDisabled,
      config: {
        ...this._defaultConfig,
        ...args,
      },
      t: args.t,
    });

    if (this._defaultConfig.eyesIsDisabled && args.isDisabled === false) {
      throw new Error(
        `Eyes is globaly disabled (via APPLITOOLS_IS_DISABLED or with applitools.config.js), ` +
          `but the test was set with isDisabled false. ` +
          `A test cannot be enabled when Eyes is disabled globaly. ` +
          `Please enable the test or enable Eyes globaly.`,
      );
    }
    if (testInfo.isDisabled) {
      return testInfo;
    }

    await this._assertClosed('open');
    this._assertCanOpen(args);
    testInfo.config.userAgent = await this._getUserAgent(args.t);

    const stringableConfig = {...testInfo.config};
    delete stringableConfig.t;
    this._logger.log(`[_openAndInitTest] opening with ${JSON.stringify(stringableConfig)}`);

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

  async _getUserAgent(t) {
    if (!this._userAgent) {
      this._userAgnet = await getUserAgent({t, logger: this._logger});
    }
    return this._userAgnet;
  }

  _attacheFunctions() {
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
  }

  _containsFailure(testsResults) {
    return testsResults.some(testResult =>
      testResult.some(r => !this._isTestResultsInstance(r) || r.getStatus() !== 'Passed'),
    );
  }

  _isTestResultsInstance(obj) {
    return !!obj.getStepsInfo && !!obj.getStatus;
  }

  _removeTestResultsIfError(testResult) {
    const e = testResult.find(r => !this._isTestResultsInstance(r));
    return e ? [e] : testResult;
  }

  _closeTest() {
    if (!this._currentTest) {
      return this._logger.log('[_closeTest] closed when no current test, ignoreing.');
    }
    const closePromise = this._currentTest.eyes.close(false);
    this._currentTest.closePromise = closePromise;
  }

  _shouldSkip(methodName) {
    if (!this._currentTest) {
      this._logger.log(`no current test, skipping ${methodName}()`);
      return true;
    }
    if (this._currentTest.isDisabled) {
      this._logger.log(`eyes is disabled, skipping ${methodName}().`);
      return true;
    }
  }

  _initTestInfo(info) {
    return {
      isTestStarted: false,
      isDisabled: false,
      config: null,
      eyes: null,
      closePromise: null,
      ...info,
    };
  }
}

module.exports = Eyes;
module.exports.default = Eyes;
