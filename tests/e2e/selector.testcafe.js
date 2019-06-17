/* global fixture, test */
import Eyes from '../../src/eyes';
const eyes = new Eyes();

fixture`Selector`.page`http://localhost:7272/helloworld.html`
  .afterEach(async () => eyes.close())
  .after(async () => await eyes.waitForResults(true));

test.skip('testcafe Eyes.e2e helloworld selector', async t => {
  await eyes.open({appName: 'TestCafeApp', testName: 'Testcafe Eyes.e2e helloworld selector', t});
  await eyes.checkWindow({
    sizeMode: 'selector',
    selector: {
      selector: 'div.fancy.title.primary',
    },
  });
});
