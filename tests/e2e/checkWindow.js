/* global fixture, test */
// import {Selector} from 'testcafe';
import Eyes from '../../src/eyes';
const eyes = new Eyes();

fixture`Getting Started`.page`https://applitools.com/helloworld`
  .after(async () => {
    const results = await eyes.waitForResults(false);
    console.log(results);
  })
  .before(async () =>
    eyes.open({
      appName: 'TestCafeApp',
      testName: 'Hello World cafe',
      // browser: [
      //     {width: 800, height: 600, name: 'firefox'},
      //     {width: 1024, height: 768, name: 'chrome'}
      // ]
    }),
  );

test('My Hello World page', async (/* t */) => {
  await eyes.checkWindow({tag: 'loaded page', saveCdt: true});
  // const button = Selector('body > div > div.section.button-section > button');
  // await t.click(button);
  // await eyes.checkWindow({tag: 'after click', saveCdt: true});
  await eyes.close();
});
