/* global fixture, test */
import {Selector} from 'testcafe';
import path from 'path';
import Eyes from '../../../';
const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');
const eyes = new Eyes({configPath});

fixture.only`Selector`.page`http://localhost:7272/helloworld.html`
  .afterEach(async () => eyes.close())
  .after(async () => await eyes.waitForResults(true));

test('testcafe Eyes.e2e helloworld selector', async t => {
  await eyes.open({appName: 'TestCafeApp', testName: 'Testcafe Eyes.e2e helloworld selector', t});
  await eyes.checkWindow({
    target: 'region',
    selector: {
      selector: 'div.fancy.title.primary',
    },
  });
});

test('testcafe Eyes.e2e helloworld Selector', async t => {
  await eyes.open({
    appName: 'TestCafeApp',
    testName: 'Testcafe Eyes.e2e helloworld Selector',
    t,
  });
  await eyes.checkWindow({
    target: 'region',
    selector: 'body > div > div.section.button-section > button',
  });
  await eyes.checkWindow({
    target: 'region',
    selector: {
      type: 'xpath',
      selector: '/html/body/div/div[1]',
    },
  });
  await eyes.checkWindow({
    target: 'region',
    selector: Selector('body > div > div.section.button-section > button'),
  });
});
