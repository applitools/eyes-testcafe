/* global fixture, test */
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`Glossary`
  .page('https://help.twitter.com/en/glossary')
  .afterEach(async () => eyes.close())
  .after(async () => eyes.waitForResults());
  
test('Glossary', async t => {
  await t.resizeWindow(1024, 768)
  await new Promise(r => setTimeout(r, 1000))
  // Start a visual test
  await eyes.open({ appName: 'Twitter Glossary', testName: `Twitter Glossary page`});
  // Test page
  await eyes.checkWindow('New user faq page');
});
