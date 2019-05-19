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
  await eyes.open({
    appName: 'Twitter App',
    testName: `Login`, 
    browser: [
      {width: 1024, height: 768, name: 'firefox'},
      {width: 1024, height: 768, name: 'chrome'},
    ]
  });

  // Test login page
  await eyes.checkWindow('Login page');

  const getPageUrl = ClientFunction(() => window.location.href.toString());
  await t
      .typeText('div.LoginForm-input.LoginForm-username > input', 'daniels69458066')
      .typeText('div.LoginForm-input.LoginForm-password > input', 'WRONG_PASSWORD')
      .click('input.EdgeButton--medium.submit.js-submit')
      .expect(getPageUrl()).contains('https://twitter.com/login/error', { timeout: 5000 })

  // Test login error page
  await eyes.checkWindow('Login error page');
});
