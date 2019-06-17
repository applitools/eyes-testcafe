/* global fixture, test */
import Eyes from '../../src/eyes';
const eyes = new Eyes();

fixture`Region`.page`http://localhost:7272/helloworld.html`
  .afterEach(async () => eyes.close())
  .after(async () => await eyes.waitForResults(true));

test.skip('testcafe Eyes.e2e helloworld region', async t => {
  await eyes.open({appName: 'TestCafeApp', testName: 'Testcafe Eyes.e2e helloworld region', t});
  await eyes.checkWindow({
    sizeMode: 'region',
    region: {top: 100, left: 0, width: 1000, height: 200},
  });
});
