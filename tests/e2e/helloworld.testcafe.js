/* global fixture, test */
import path from 'path';
import Eyes from '../../src/eyes';
const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');
const eyes = new Eyes({configPath});

fixture`Hello world`.page`http://localhost:7272/helloworld.html`
  .afterEach(async () => eyes.close())
  .after(async () => await eyes.waitForResults(true));

test('testcafe Eyes.e2e helloworld', async t => {
  await eyes.open({appName: 'TestCafeApp', testName: 'Testcafe Eyes.e2e helloworld', t});
  await eyes.checkWindow({tag: 'page loaded'});
});
