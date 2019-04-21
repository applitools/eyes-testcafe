'use strict';
const fs = require('fs');
const {promisify} = require('util');
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {resolve} = require('path');
const createTestCafe = require('testcafe');
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const testServer = require('../util/testServer');
const resultCdtPath = resolve(__dirname, '../../cdt.json');
const testPath = resolve(__dirname, 'processPageAndSerializeTest.js');

describe('processPageAndSerialize', () => {
  let closeTestServer;

  before(async () => {
    const server = await testServer({port: 7272});
    closeTestServer = server.close;
  });

  after(async () => {
    await closeTestServer();
    try {
      await unlink(resultCdtPath);
    } catch (_e) {}
  });

  it('works', async () => {
    let testcafe = null;
    const expectedCdt = {};
    createTestCafe('localhost', 1337)
      .then(tc => {
        testcafe = tc;
        const runner = testcafe.createRunner();

        return runner
          .src([testPath])
          .browsers(['chrome:headless'])
          .run();
      })
      .then(failedCount => {
        expect(failedCount).to.eq(0);
      })
      .finally(() => testcafe.close())
      .then(getCdt)
      .then(cdt => {
        expect(cdt).to.deep.eq(expectedCdt);
      });
  });

  async function getCdt() {
    return readFile(resultCdtPath);
  }
});
