'use strict';

function makeMapProxyUrls({collectFrameData, getProxyUrl, logger}) {
  return function(frame) {
    const proxyStyleElements = getStyleElementsFromFrame(frame).filter(e => e.nodeValue);
    const cssBlobs = collectFrameData({
      frame,
      predicate: r => r.type && r.type.trimStart().startsWith('text/css'),
      keyName: 'blobs',
    });
    cssBlobs.forEach(r => (r.value = r.value.toString()));
    const styleAttrs = collectFrameData({
      frame,
      predicate: n =>
        n.nodeType === 1 && n.attributes && n.attributes.some(a => a.name === 'style'),
      keyName: 'cdt',
    }).map(n => n.attributes.find(a => a.name === 'style'));

    let proxyUrl =
      findProxyUrl(cssBlobs.map(r => r.value)) ||
      findProxyUrl(proxyStyleElements.map(n => n.nodeValue)) ||
      findProxyUrl(styleAttrs.map(a => a.value));
    if (!proxyUrl) {
      logger.log('warning cannot get proxy url !!');
    }

    logger.log(`mapping proxy url ${proxyUrl} for ${cssBlobs.length} css blobs`);
    cssBlobs.forEach(r => (r.value = Buffer.from(doMapProxyUrls(r.value, proxyUrl))));
    logger.log(`mapping proxy url ${proxyUrl} for ${proxyStyleElements.length} style elements`);
    proxyStyleElements.forEach(n => (n.nodeValue = doMapProxyUrls(n.nodeValue, proxyUrl)));
    logger.log(`mapping proxy url ${proxyUrl} for ${styleAttrs.length} style attributes`);
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

  function getStyleElementsFromFrame(frame) {
    let styleElements = frame.cdt
      .filter(n => n.nodeType === 1 && n.nodeName === 'STYLE')
      .map(n => n.childNodeIndexes);
    styleElements = [].concat
      .apply([], styleElements)
      .map(i => i !== undefined && frame.cdt[i])
      .filter(Boolean);
    return [].concat.apply(styleElements, frame.frames.map(f => getStyleElementsFromFrame(f)));
  }
}

module.exports = makeMapProxyUrls;
