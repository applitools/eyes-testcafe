/* global fixture, test */
const fs = require('fs');
const path = require('path');
const Eyes = require('../../..');
const {expect} = require('chai');
const eyes = new Eyes();

fixture`Simple`.page`http://localhost:7272/simple.html`;

test('testcafe Eyes.it simple', async t => {
  const result = await eyes._processPage(t);
  expect(result.scriptVersion).to.eql(require('@applitools/dom-snapshot/package.json').version);
  delete result.scriptVersion;

  const fixturePath = path.resolve(__dirname, '../../fixtures/simple.dom.json');

  if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
    fs.writeFileSync(fixturePath, JSON.stringify(result, null, 2));
  }

  const expected = JSON.parse(fs.readFileSync(fixturePath));
  expect(result).to.eql(expected);
});
