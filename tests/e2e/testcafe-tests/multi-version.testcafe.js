/* global fixture, test */
import path from 'path';
import Eyes from '../../../';
const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');
const eyes = new Eyes({configPath});

fixture`Multi browser version`.page`http://localhost:7272/helloworld.html`
  .afterEach(async () => eyes.close())
  .after(async () => await eyes.waitForResults(true));

const browsers = [
  {width: 640, height: 480, name: 'chrome-one-version-back'},
  {width: 640, height: 480, name: 'chrome-two-versions-back'},
  {width: 640, height: 480, name: 'firefox-one-version-back'},
  {width: 640, height: 480, name: 'firefox-two-versions-back'},
];

browsers.forEach(browser => {
  test(`testcafe Eyes.e2e multi browser version - ${browser.name}`, async t => {
    await eyes.open({
      appName: 'TestCafeApp',
      testName: `Testcafe Eyes.e2e multi-browser-version - ${browser.name}`,
      browser,
      t,
    });
    await eyes.checkWindow({
      tag: 'page loaded',
    });
  });
});
