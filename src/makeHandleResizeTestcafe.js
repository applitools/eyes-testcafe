'use strict';

function makeHandleResizeTestcafe({logger, defaultViewport}) {
  return async function(browser, t, currentSize = {}) {
    let b = browser;
    if (Array.isArray(browser) && isOneSize(browser)) {
      b = browser[0];
    }
    const width = (b && b.width) || (!b && defaultViewport.width);
    const height = (b && b.height) || (!b && defaultViewport.height);

    if (width && height && (currentSize.width !== width || currentSize.height !== height)) {
      logger.log('setting testcafe viewport size', {width, height});
      await t.resizeWindow(width, height);
    }
    return {width, height};
  };
}

function isOneSize(browser) {
  const width = browser[0].width;
  const height = browser[0].height;
  if (width && height) {
    return browser.every(b => b.width === width && b.height === height);
  }
}

module.exports = makeHandleResizeTestcafe;
