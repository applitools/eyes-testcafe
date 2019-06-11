'use strict';

function makeMapProxyUrls({collectFrameData, getProxyUrl, logger}) {
  return function(frame) {
    const cssBlobs = collectFrameData({
      frame,
      predicate: r => r.type && r.type.trimStart().startsWith('text/css'),
      keyName: 'blobs',
    });
    cssBlobs.forEach(r => (r.value = r.value.toString()));
    const proxyStyleNodes = collectFrameData({
      frame,
      predicate: n => n.nodeType === 3 && n.nodeValue.match(/\/\*hammerhead\|stylesheet/),
      keyName: 'cdt',
    });
    const styleAttrs = collectFrameData({
      frame,
      predicate: n =>
        n.nodeType === 1 && n.attributes && n.attributes.some(a => a.name === 'style'),
      keyName: 'cdt',
    }).map(n => n.attributes.find(a => a.name === 'style'));

    let proxyUrl =
      findProxyUrl(cssBlobs.map(r => r.value)) ||
      findProxyUrl(proxyStyleNodes.map(n => n.nodeValue)) ||
      findProxyUrl(styleAttrs.map(a => a.value));
    if (!proxyUrl) {
      logger.log('warning cannot get proxy url !!');
    }

    logger.log(`mapping proxy url ${proxyUrl} for ${cssBlobs.length} css blobs`);
    cssBlobs.forEach(r => (r.value = Buffer.from(doMapProxyUrls(r.value, proxyUrl))));
    logger.log(`mapping proxy url ${proxyUrl} for ${proxyStyleNodes.length} style element`);
    proxyStyleNodes.forEach(n => (n.nodeValue = doMapProxyUrls(n.nodeValue, proxyUrl)));
    logger.log(`mapping proxy url ${proxyUrl} for ${styleAttrs.length} style attribute`);
    styleAttrs.forEach(a => (a.value = doMapProxyUrls(a.value, proxyUrl)));
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
