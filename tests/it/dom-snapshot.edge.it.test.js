'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {resolve} = require('path');
const createTestCafe = require('testcafe');
const testPath = resolve(__dirname, 'testcafe-tests/*.testcafe.js');
const testServer = require('../util/testServer');

// NOTE:
// The individual testcafe.js file works when run by itself but the test is
// unable to be run in tandem with other Sauce tests through Mocha - it just
// hangs. Seems to be a limitation of the Sauce Connect tunnel library
// Skipping for now. Will need to address in the new eyes-testcafe SDK.
describe.skip('Eyes integration tests', () => {
  let closeTestServer;
  before(async () => {
    const server = await testServer({port: 7272});
    closeTestServer = server.close;
  });

  after(async () => {
    await closeTestServer();
  });

  it('works', async () => {
    let testcafe = null;
    let failedCount;
    await createTestCafe('localhost', 1337)
      .then(tc => {
        testcafe = tc;
        const runner = testcafe.createRunner();
        return runner
          .src([testPath])
          .browsers(['saucelabs:MicrosoftEdge@18.17763:Windows 10'])
          .run();
      })
      .then(_failedCount => {
        failedCount = _failedCount;
      })
      .finally(() => testcafe.close());
    expect(failedCount).to.eq(0);
  });
});
