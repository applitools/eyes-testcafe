/* global fixture, test */
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`Help page`
  .page('https://help.twitter.com/')
  .afterEach(async () => eyes.close())
  .after(async () => eyes.waitForResults());

test('Help page', async t => {
  await t.resizeWindow(1024, 768);
  await new Promise(r => setTimeout(r, 1000))
  await eyes.open({ appName: 'Twitter help center', testName: `Twitter help page`});
  await eyes.checkWindow('help page');
});
