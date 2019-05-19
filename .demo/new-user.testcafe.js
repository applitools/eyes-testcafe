/* global fixture, test */
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`New user faq`
  .page('https://help.twitter.com/en/new-user-faq')
  .afterEach(async () => eyes.close())
  .after(async () => eyes.waitForResults());
  
test('New user faq', async t => {
  // Start a visual test
  await eyes.open({ appName: 'Twitter faq', testName: `Twitter New user faq`});
  // test page
  await eyes.checkWindow('New user faq page');
});
