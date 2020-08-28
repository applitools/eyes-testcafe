'use strict';

const {ClientFunction} = require('testcafe');
const EYES_NAME_SPACE = '__EYES__APPLITOOLS__';
const MAX_OBJECT_SIZE = 1024 * 1024 * 4.0; // 4 MB

/*
 * Split the result to smaller chunks if it is too big.
 * See: https://github.com/DevExpress/testcafe/issues/1110
 */
function makeClientFunctionWrapper({
  clientFunctionExecuter = ClientFunction,
  stringifyResult = r => JSON.stringify(r),
  parseResult = JSON.parse,
  maxObjectSize = MAX_OBJECT_SIZE,
  window,
  logger,
}) {
  return async function(browserFunction, dependencies = {}) {
    const functionArgs = dependencies.functionArgs; // needed for unit test to pass b/c of "dependencies" magic
    const getResultSize = clientFunctionExecuter(
      () => {
        // eslint-disable-next-line no-undef
        return browserFunction(functionArgs).then((result = {}) => {
          const resultStr = stringifyResult(result);
          if (!window[EYES_NAME_SPACE]) {
            window[EYES_NAME_SPACE] = {};
          }
          window[EYES_NAME_SPACE].clientFunctionResult = resultStr;
          return resultStr.length;
        });
      },
      {
        dependencies: {
          EYES_NAME_SPACE,
          browserFunction,
          stringifyResult,
          ...dependencies,
        },
      },
    );

    const getResult = clientFunctionExecuter(
      (start, end) => {
        return window[EYES_NAME_SPACE].clientFunctionResult.substring(start, end);
      },
      {dependencies: {EYES_NAME_SPACE: EYES_NAME_SPACE}},
    );

    return async t => {
      const testName =
        t && t.testRun && t.testRun.test ? t.testRun.test.name : Math.floor(Math.random() * 100);
      const getResultSizeWithT = getResultSize.with({boundTestRun: t});
      const getResultWithT = getResult.with({boundTestRun: t});
      logger.log(`[${testName}] fetching ClientFunction result and its size`);
      const size = await getResultSizeWithT();
      logger.log(`[${testName}] done fetching ClientFunction result and its size`);
      const splits = Math.ceil(size / maxObjectSize);
      logger.log(`[${testName}] starting to collect ClientFunction result of size ${size}`);
      let result = '';
      for (let i = 0; i < splits; i++) {
        const start = i * maxObjectSize;
        logger.log(`[${testName}] getting ClientFunction result chunk ${i + 1} of ${splits}`);
        result += await getResultWithT(start, start + maxObjectSize);
      }
      logger.log(`[${testName}] done collecting ClientFunction result of size ${size}`);
      const browserConsoleLogs = t && (await t.getBrowserConsoleMessages());
      if (process.env.APPLITOOLS_SHOW_LOGS && browserConsoleLogs) {
        browserConsoleLogs.log.forEach(entry => {
          console.log(entry);
        });
      }
      return parseResult(result);
    };
  };
}

module.exports = makeClientFunctionWrapper;
