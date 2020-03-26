'use strict';

const {resolve} = require('path');
const createTestCafe = require('testcafe');
const testPath = resolve(__dirname, 'render.testcafe.js');

let testcafe = null;
createTestCafe('localhost', 1339)
  .then(tc => {
    testcafe = tc;
    const isLive = !['false', '0'].includes(process.env.LIVE) && !!process.env.LIVE;
    const runner = !isLive ? testcafe.createRunner() : testcafe.createLiveModeRunner();
    const browser = !isLive ? 'chrome:headless' : 'chrome';

    return runner
      .src([testPath])
      .browsers([browser])
      .run({});
  })
  .finally(() => testcafe && testcafe.close());
