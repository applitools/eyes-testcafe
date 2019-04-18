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
  // const button = Selector('body > div.demo-page.center > div.section.button-section > button');
  // await t.click(button);

  await eyes.eyesOpen({appName: 'TestCafeApp', testName: 'Cafe'});
  await eyes.checkWindow('some name');
  (function() { 
        return (
          function () {\n      return (0, _isIterable3.default)(Object({}));\n});})();","args":[[]],"dependencies":[{}]
  await eyes.close();
});
