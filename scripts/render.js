'use strict';

const {resolve} = require('path');
const createTestCafe = require('testcafe');
const testPath = resolve(__dirname, 'render.testcafe.js');

let testcafe = null;
createTestCafe('localhost', 1339)
  .then(tc => {
    testcafe = tc;
    const runner = testcafe.createRunner();
    return runner
      .src([testPath])
      .browsers(['chrome:headless'])
      .run();
  })
  .finally(() => testcafe.close());
