import {Selector} from 'testcafe';
import Eyes from '../src/eyes';
const eyes = new Eyes();

fixture`Getting Started`.page`https://applitools.com/helloworld`;
// .after(Eyes.close)
// .before(() =>
//     Eyes.eyesOpen({
//         appName: 'TestCafeApp',
//         testName: 'Cafe',
//         // browser: [
//         //     {width: 800, height: 600, name: 'firefox'},
//         //     {width: 1024, height: 768, name: 'chrome'}
//         // ]
//     })
// );

test('My App Test', async t => {
  // const checkbox = Selector('#my-checkbox');
  // await t
  //   .click(checkbox)
  //   .expect(checkbox.checked)
  //   .ok();

  await eyes.eyesOpen({appName: 'TestCafeApp', testName: 'Cafe'});
  await eyes.checkWindow('some name');
  await eyes.close();
});
