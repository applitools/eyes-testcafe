'use strict';
const fs = require('fs');
const {promisify} = require('util');
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {resolve} = require('path');
const createTestCafe = require('testcafe');
const resultCdtPath = resolve(__dirname, '../../cdt.json');
const testPath = resolve(__dirname, 'helloworld.js');
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

describe('Eyes', () => {
  after(async () => {
    try {
      await unlink(resultCdtPath);
    } catch (e) {
      console.log(e);
    }
  });

  it.only('works', async () => {
    let testcafe = null;
    return createTestCafe('localhost', 1337)
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
        expect(cdt).to.deep.eq(getExpectedCdtFile());
      });
  });

  async function getCdt() {
    const cdt = await readFile(resultCdtPath, 'utf8');
    return JSON.parse(cdt || {});
  }

  function getExpectedCdtFile() {
    return {
      cdt: [
        {nodeType: 9, childNodeIndexes: [1, 13]},
        {nodeType: 10, nodeName: 'html'},
        {nodeType: 1, nodeName: 'HEAD', attributes: [], childNodeIndexes: []},
        {nodeType: 3, nodeValue: '\n  '},
        {nodeType: 3, nodeValue: '\n    Hello\n    '},
        {nodeType: 3, nodeValue: '\n        A Button\n    '},
        {
          nodeType: 1,
          nodeName: 'BUTTON',
          attributes: [{name: 'someatrr2', value: 'val2'}],
          childNodeIndexes: [5],
        },
        {nodeType: 3, nodeValue: '\n  '},
        {
          nodeType: 1,
          nodeName: 'DIV',
          attributes: [{name: 'someatrr', value: 'val'}],
          childNodeIndexes: [4, 6, 7],
        },
        {nodeType: 3, nodeValue: '\n  '},
        {
          nodeType: 1,
          nodeName: 'SCRIPT',
          attributes: [{name: 'someattr', value: 'yo'}],
          childNodeIndexes: [],
        },
        {nodeType: 3, nodeValue: '\n\n'},
        {nodeType: 1, nodeName: 'BODY', attributes: [], childNodeIndexes: [3, 8, 9, 10, 11]},
        {nodeType: 1, nodeName: 'HTML', attributes: [], childNodeIndexes: [2, 12]},
      ],
      url: 'http://localhost:7272/basicCdt.html',
      resourceUrls: [],
      blobs: [],
      frames: [],
    };
  }
});
