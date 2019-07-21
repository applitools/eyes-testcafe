/* global fixture, test */
import path from 'path';
import Eyes from '../../src/eyes';
const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');
const eyes = new Eyes({configPath});

fixture`Region`.page`http://localhost:7272/helloworld.html`
  .afterEach(async () => eyes.close())
  .after(async () => await eyes.waitForResults(true));

test('testcafe Eyes.e2e helloworld region', async t => {
  await eyes.open({appName: 'TestCafeApp', testName: 'Testcafe Eyes.e2e helloworld region', t});
  await eyes.checkWindow({
    target: 'region',
    region: {top: 100, left: 0, width: 1000, height: 200},
  });
});
