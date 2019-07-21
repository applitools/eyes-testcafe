/* global fixture, test */
import {Selector} from 'testcafe';
import path from 'path';
import Eyes from '../../src/eyes';
const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');
const eyes = new Eyes({configPath});

fixture`Ignore`.page`http://localhost:7272/helloworld.html?diff1`
  .afterEach(async () => eyes.close())
  .after(async () => await eyes.waitForResults(true));

test('testcafe Eyes.e2e helloworld ignore', async t => {
  await eyes.open({
    appName: 'TestCafeApp',
    testName: 'Testcafe Eyes.e2e helloworld Testcafe ignore',
    t,
  });
  await eyes.checkWindow({
    ignore: {selector: 'body > div > div:nth-child(2) > p:nth-child(4)'},
  });
  await eyes.checkWindow({
    ignore: {selector: {type: 'xpath', selector: '//HTML[1]/BODY[1]/DIV[1]/DIV[2]/P[4]'}},
  });
  await eyes.checkWindow({
    target: 'region',
    selector: Selector('body > div'),
    ignore: [
      {selector: Selector('body > div > div:nth-child(2) > p:nth-child(4)')},
      {top: 100, left: 0, width: 500, height: 100},
    ],
  });
});
