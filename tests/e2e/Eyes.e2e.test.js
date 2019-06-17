'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {resolve} = require('path');
const createTestCafe = require('testcafe');
const testPath = resolve(__dirname, '*.testcafe.js');
const testServer = require('../util/testServer');

describe('Eyes', () => {
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
          .browsers(['chrome:headless'])
          .run();
      })
      .then(_failedCount => {
        failedCount = _failedCount;
      })
      .finally(() => testcafe.close());
    expect(failedCount).to.eq(0);
  });
});
