/* global fixture, test */
const fs = require('fs');
const path = require('path');
const Eyes = require('../../..');
const {expect} = require('chai');
const eyes = new Eyes();

fixture`Simple`.page`http://applitools.github.io/demo/DomSnapshot/simple.html`;

test('testcafe Eyes.it simple', async t => {
  const result = await eyes._processPage(t);
  expect(result.scriptVersion).to.eql(require('@applitools/dom-snapshot/package.json').version);
  delete result.scriptVersion;

  let fixtureName;

  if (t.browser.name === 'Microsoft Edge') {
    fixtureName = 'simple.edge.dom.json';
  } else if (t.browser.name === 'Internet Explorer') {
    fixtureName = 'simple.ie11.dom.json';
  } else {
    fixtureName = 'simple.dom.json';
  }

  const fixturePath = path.resolve(__dirname, '../../fixtures/', fixtureName);

  if (process.env.APPLITOOLS_UPDATE_FIXTURES) {
    fs.writeFileSync(fixturePath, JSON.stringify(result, null, 2));
  }

  const expected = JSON.parse(fs.readFileSync(fixturePath));
  expect(result).to.eql(expected);
});
