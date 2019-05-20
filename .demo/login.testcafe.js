/* global fixture, test */
import { ClientFunction } from 'testcafe';
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`Login`
  .page('https://twitter.com')
  .afterEach(async () => eyes.close())
  .after(async () => eyes.waitForResults());

test('Login', async t => {
  // Start a visual test
  await eyes.open({appName: 'Twitter App', testName: `Twitter Login`});

  // Test page
  await eyes.checkWindow('Login page');
});
