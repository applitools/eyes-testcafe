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
    const getResultSize = clientFunctionExecuter(
      () =>
        browserFunction().then((result = {}) => {
          const resultStr = stringifyResult(result);
          if (!window[EYES_NAME_SPACE]) {
            window[EYES_NAME_SPACE] = {};
          }
          window[EYES_NAME_SPACE].clientFunctionResult = resultStr;
          return resultStr.length;
        }),
      {dependencies: {EYES_NAME_SPACE, browserFunction, stringifyResult, ...dependencies}},
    );

    const getResult = clientFunctionExecuter(
      (start, end) => {
        return window[EYES_NAME_SPACE].clientFunctionResult.substring(start, end);
      },
      {dependencies: {EYES_NAME_SPACE: EYES_NAME_SPACE}},
    );

    return async () => {
      const size = await getResultSize();
      const splits = Math.ceil(size / maxObjectSize);
      logger.log(`starting to collect ClientFunction result of size ${size}`);
      let result = '';
      for (let i = 0; i < splits; i++) {
        const start = i * maxObjectSize;
        logger.log(`getting ClientFunction result chunk ${i + 1} of ${splits}`);
        result += await getResult(start, start + maxObjectSize);
      }
      return parseResult(result);
    };
  };
}

module.exports = makeClientFunctionWrapper;
