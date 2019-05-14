'use strict';
const {Logger} = require('@applitools/eyes-common');
const logger = new Logger(false, 'testcafe:mapResourcesProxyUrls');

function makeMapProxyUrls({collectFrameData, getProxyUrl}) {
  return function(frame) {
    const cssResources = collectFrameData({
      frame,
      predicate: r => r.type.trimStart().startsWith('text/css'),
      keyName: 'blobs',
    });
    const styleProxyNodes = collectFrameData({
      frame,
      predicate: n => n.nodeType === 3 && n.nodeValue.match(/\/\*hammerhead\|stylesheet/),
      keyName: 'cdt',
    });
    cssResources.forEach(r => (r.value = r.value.toString()));

    let proxyUrl =
      findProxyUrl(cssResources.map(r => r.value)) ||
      findProxyUrl(styleProxyNodes.map(n => n.nodeValue));
    if (!proxyUrl) {
      logger.log('warning cannot get proxy url !!');
    }
    cssResources.forEach(r => {
      logger.log(`mapping proxy url ${proxyUrl} for ${r.url}`);
      const newValue = doMapProxyUrls(r.value, proxyUrl);
      r.value = Buffer.from(newValue);
    });
    styleProxyNodes.forEach(n => {
      logger.log(`mapping proxy url ${proxyUrl} for style node`);
      n.nodeValue = doMapProxyUrls(n.nodeValue, proxyUrl);
    });
  };

  function findProxyUrl(arr) {
    let proxyUrl;
    arr.some(text => ((proxyUrl = getProxyUrl(text)), proxyUrl));
    return proxyUrl;
  }

  function doMapProxyUrls(text, proxyUrl) {
    return text.replace(new RegExp(proxyUrl, 'g'), '');
  }
}

module.exports = makeMapProxyUrls;
