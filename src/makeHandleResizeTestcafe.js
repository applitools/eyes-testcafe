'use strict';

function makeHandleResizeTestcafe({logger, defaultViewport}) {
  return async function(browser, t) {
    let b = browser;
    if (Array.isArray(browser) && browser.length === 1) {
      b = browser[0];
    }
    if (b && b.width && b.height) {
      logger.log('setting testcafe viewport size', b.width, b.height);
      await t.resizeWindow(b.width, b.height);
    } else if (!b) {
      logger.log('setting testcafe viewport size', defaultViewport);
      await t.resizeWindow(defaultViewport.width, defaultViewport.height);
    }
  };
}

module.exports = makeHandleResizeTestcafe;
