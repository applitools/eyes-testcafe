/* global fixture, test */
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`Contact us`
  .page('https://help.twitter.com/en/contact-us')
  .afterEach(async () => eyes.close())
  .after(async () => eyes.waitForResults());
  
test('Contact us', async t => {
  // Start a visual test
  await eyes.open({ appName: 'Twitter help center', testName: `Twitter Contact us`});
  // test page
  await eyes.checkWindow('Contact us page');
});
