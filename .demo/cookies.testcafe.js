/* global fixture, test */
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`Cookies explained`
  .page('https://help.twitter.com/en/rules-and-policies/twitter-cookies')
  .afterEach(async () => eyes.close())
  .after(async () => eyes.waitForResults());
  
test('Cookies', async t => {
  // Start a visual test
  await eyes.open({ appName: 'Twitter App', testName: `Twitter cookies explained`});
  // Test page
  await eyes.checkWindow('Cookies explained page');
});
