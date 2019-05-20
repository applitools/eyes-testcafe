/* global fixture, test */
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`Contact us`
  .page('https://help.twitter.com/en/contact-us')
  .afterEach(async () => eyes.close())
  .after(async () => eyes.waitForResults());

test('Contact us menu', async t => {
  // Start a visual test
  await eyes.open({ appName: 'Twitter help center', testName: `Twitter Contact us menu`});
  await eyes.checkWindow('menu 1');

  // Click "I want to report abusive behavior or sensitive content"
  await t.click('article:nth-child(2) > div > a')
  await new Promise(r => setTimeout(r, 500))
  await eyes.checkWindow('menu 2');
});
