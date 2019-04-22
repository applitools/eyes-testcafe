'use strict';
import {ClientFunction} from 'testcafe';
const EYES_NAME_SPACE = '__EYES__APPLITOOLS__';
const MAX_OBJECT_SIZE = 1024 * 1024 * 4.0; // 4 MB

/*
 * Split the result to smaller chunks if it is too big.
 * See: https://github.com/DevExpress/testcafe/issues/1110
 */
async function clientFunctionJsonWrapper(fn, dependencies = {}) {
  const getResultSize = ClientFunction(
    () =>
      fn().then((result = {}) => {
        const resultStr = JSON.stringify(result);
        if (!window[EYES_NAME_SPACE]) {
          window[EYES_NAME_SPACE] = {};
        }
        window[EYES_NAME_SPACE].clientFunctionResult = resultStr;
        return resultStr.length;
      }),
    {dependencies: {EYES_NAME_SPACE, fn, ...dependencies}},
  );

  const getResult = ClientFunction(
    (start, end) => {
      return window[EYES_NAME_SPACE].clientFunctionResult.substring(start, end);
    },
    {dependencies: {EYES_NAME_SPACE: EYES_NAME_SPACE}},
  );

  return async () => {
    const size = await getResultSize();
    const splits = Math.ceil(size / MAX_OBJECT_SIZE);
    let result = '';
    for (let i = 0; i < splits; i++) {
      const start = i * MAX_OBJECT_SIZE;
      result += await getResult(start, start + MAX_OBJECT_SIZE);
    }
    return JSON.parse(result);
  };
}

module.exports = clientFunctionJsonWrapper;
