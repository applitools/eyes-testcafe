/* global fixture, test */
import path from 'path';
import Eyes from '../../../';
const configPath = path.resolve(__dirname, '../../fixtures/applitools.config.js');
const eyes = new Eyes({configPath});

fixture`iOS device emulation`.page`http://applitools.github.io/demo`
  .afterEach(async () => eyes.close())
  .after(async () => await eyes.waitForResults(true));

test(`testcafe Eyes.e2e ios device emulation`, async t => {
  await eyes.open({
    appName: 'Eyes SDK',
    testName: `UFG Mobile Web Happy Flow`,
    browser: {
      iosDeviceInfo: {
        deviceName: 'iPhone XR',
        screenOrientation: 'landscapeLeft',
      },
    },
    t,
  });
  await eyes.checkWindow({
    tag: 'page loaded',
  });
});
