'use strict';

import Eyes from '../../';
import {Selector} from 'testcafe'

(
  async () => {

    const eyes = new Eyes()

    // await eyes.open({appName: 'TestCafeApp', testName: 'Testcafe Eyes.e2e helloworld b', t})

    await eyes.checkWindow('only tag');

    await eyes.checkWindow({
      tag: 'page loaded 4',
    });

    await eyes.checkWindow('some string')

    await eyes.checkWindow({
      layout: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-test-as-layout'},
        {selector: Selector('.some-div')}
      ],
      strict: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-test-as-strict'},
        {selector: Selector('.some-div')}
      ],
      content: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-test-as-content'},
        {selector: Selector('.some-div')}
      ],
      scriptHooks: {
        beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'"
      },
      sendDom: false,
      accessibility: [
        {accessibilityType: 'RegularText', selector: '.some-div'},
        {accessibilityType: 'RegularText', selector: Selector('.some-div-2')},
        {accessibilityType: 'LargeText', selector: '//*[@id="main"]/h1', type: 'xpath'},
        {accessibilityType: 'BoldText', top: 100, left: 0, width: 1000, height: 100},
      ],
      ignore: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-ignore'},
        {selector: Selector('.some-div')}
      ],
      floating: [
        {top: 100, left: 0, width: 1000, height: 100, maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
        {selector: '.some-div-to-float', maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
        {selector: Selector('.some-div'), maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20}
      ]
    });

    eyes.checkWindow({
      target: 'region',
      region: {top: 100, left: 0, width: 1000, height: 200}
    });

    // The shorthand string version defaults to css selectors
    eyes.checkWindow({
      target: 'region',
      selector: '.my-element'
    });

    // Using a css selector
    eyes.checkWindow({
      target: 'region',
      selector: {
        type: 'css',
        selector: '.my-element' // or '//button'
      }
    });

    // Using a Testcafe Selector
    eyes.checkWindow({
      target: 'region',
      selector: Selector('.my-region')
    });

    // Using an xpath selector
    eyes.checkWindow({
      target: 'region',
      selector: {
        type: 'xpath',
        selector: '//button[1]'
      }
    });

    // capture viewport only
    eyes.checkWindow({
      target: 'window',
      fully: false,
    });

    eyes.close()
    
    await eyes.waitForResults(true);
    await eyes.waitForResults();
  }
)()