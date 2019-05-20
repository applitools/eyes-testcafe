/* global fixture, test */
import { ClientFunction } from 'testcafe';
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`Login`
  .page('https://mobile.twitter.com')
  .afterEach(async () => eyes.close())
  .after(async () => eyes.waitForResults());

test('Login', async t => {
  // Start a visual test
  await eyes.open({
    appName: 'Twitter App',
    testName: `Login`, 
    browser: [
      // {width: 1024, height: 768, name: 'firefox'},
      {width: 1024, height: 768, name: 'chrome'},
    ]
  });

  // Test login page
  // await eyes.checkWindow('Login page');

  const getPageUrl = ClientFunction(() => window.location.href.toString());
  await t
      .typeText('#react-root > div > div > div > main > div > div.css-1dbjc4n.r-13awgt0 > div > div:nth-child(1) > div.css-1dbjc4n.r-1awozwy.r-1d2f490.r-7v430y.r-1j3t67a.r-u8s1d.r-1s7wq8y.r-13qz1uu > form > div > div:nth-child(6) > div > label > div.css-1dbjc4n.r-18u37iz.r-16y2uox.r-1wbh5a2.r-1udh08x > div > input', 'daniels69458066')
      .typeText('#react-root > div > div > div > main > div > div.css-1dbjc4n.r-13awgt0 > div > div:nth-child(1) > div.css-1dbjc4n.r-1awozwy.r-1d2f490.r-7v430y.r-1j3t67a.r-u8s1d.r-1s7wq8y.r-13qz1uu > form > div > div:nth-child(7) > div > label > div.css-1dbjc4n.r-18u37iz.r-16y2uox.r-1wbh5a2.r-1udh08x > div > input', 'ukw6gSnZNMWgrhS')
      .click('#react-root > div > div > div > main > div > div.css-1dbjc4n.r-13awgt0 > div > div:nth-child(1) > div.css-1dbjc4n.r-1awozwy.r-1d2f490.r-7v430y.r-1j3t67a.r-u8s1d.r-1s7wq8y.r-13qz1uu > form > div > div.css-1dbjc4n.r-eqz5dr.r-1777fci > div > div > span > span')
      .expect(getPageUrl()).contains('https://mobile.twitter.com/home', { timeout: 5000 })
  await new Promise(r => setTimeout(r, 3000))
  // Test login error page
  await eyes.checkWindow('Login error page');
});
