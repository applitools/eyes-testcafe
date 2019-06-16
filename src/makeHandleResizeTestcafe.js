'use strict';

function makeHandleResizeTestcafe({logger, defaultViewport}) {
  return async function(browser, t, currentSize = {}) {
    let b = browser;
    if (Array.isArray(browser) && isOneSize(browser)) {
      b = browser[0];
    }
    let requiredSize;
    if (b && b.width && b.height) {
      requiredSize = b;
    } else if (!b) {
      requiredSize = defaultViewport;
    }

    if (
      requiredSize &&
      (currentSize.width !== requiredSize.width || currentSize.height !== requiredSize.height)
    ) {
      logger.log('setting testcafe viewport size', requiredSize);
      await t.resizeWindow(requiredSize.width, requiredSize.height);
    }
    return requiredSize;
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
