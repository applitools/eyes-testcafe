'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {resolve} = require('path');
const createTestCafe = require('testcafe');
const testPath = resolve(__dirname, 'testcafe-tests/*.testcafe.js');
const testServer = require('../util/testServer');

// NOTE:
// this test throws an error of 'assign' is not a function
// skipping for now, will need to address in the new eyes-testcafe
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
          .browsers(['saucelabs:Internet Explorer@11.0:Windows 7'])
          .run();
      })
      .then(_failedCount => {
        failedCount = _failedCount;
      })
      .finally(() => testcafe.close());
    expect(failedCount).to.eq(0);
  });
});
