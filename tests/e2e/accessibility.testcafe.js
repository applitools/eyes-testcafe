/* global fixture, test */
import path from 'path';
import Eyes from '../../src/eyes';
const {expect} = require('chai');
const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');
const eyes = new Eyes({configPath});
const fetch = require('node-fetch');

fixture`TestAccessibility`.page`http://localhost:7272/helloworld.html`;

test('testcafe Eyes.e2e accessibility', async t => {
  const accessibilitySettings = {level: 'AA', guidelinesVersion: 'WCAG_2_0'};
  await eyes.open({
    appName: 'TestCafeApp',
    testName: 'Testcafe Eyes.e2e helloworld selector',
    t,
    accessibilityValidation: accessibilitySettings,
  });
  await eyes.checkWindow({
    accessibility: {
      selector: 'div.fancy.title.primary',
      accessibilityType: 'LargeText',
    },
  });

  await eyes.close();
  const [[testResults]] = await eyes.waitForResults(false);

  const sessionAccessibilityStatus = testResults.getAccessibilityStatus();
  expect(sessionAccessibilityStatus).to.be.ok;
  expect(sessionAccessibilityStatus.status).to.be.ok;
  expect(sessionAccessibilityStatus.version).to.equal(accessibilitySettings.guidelinesVersion);
  expect(sessionAccessibilityStatus.level).to.equal(accessibilitySettings.level);

  const sessionUrl = `${testResults
    .getApiUrls()
    .getSession()}?format=json&AccessToken=${testResults.getSecretToken()}&apiKey=${
    process.env.APPLITOOLS_API_KEY
  }`;

  const session = await fetch(sessionUrl).then(r => r.json());
  const [actualAppOutput] = session.actualAppOutput;

  expect(actualAppOutput.imageMatchSettings.accessibilitySettings).to.eql({
    level: accessibilitySettings.level,
    version: accessibilitySettings.guidelinesVersion,
  });

  expect(actualAppOutput.imageMatchSettings.accessibility).to.eql([
    {type: 'LargeText', isDisabled: false, left: 205, top: 5, width: 615, height: 70},
  ]);
});
