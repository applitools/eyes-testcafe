'use strict';
const absolutizeUrl = require('./absolutizeUrl');

function makeMapProxyUrls({collectFrameData, getProxyUrl, logger}) {
  return function(frame) {
    const allBlobs = collectFrameData({frame, keyName: 'blobs'});
    const cssBlobs = collectFrameData({
      frame,
      predicate: r => r.type && r.type.startsWith('text/css'),
      keyName: 'blobs',
    });
    cssBlobs.forEach(r => (r.value = r.value.toString()));

    const proxyStyleElements = getStyleElementsFromFrame(frame).filter(e => e.nodeValue);
    const styleAttrs = collectFrameData({
      frame,
      predicate: n =>
        n.nodeType === 1 && n.attributes && n.attributes.some(a => a.name === 'style'),
      keyName: 'cdt',
    }).map(n => n.attributes.find(a => a.name === 'style'));

    let proxyUrl =
      findProxyUrl(allBlobs.map(b => b.url)) ||
      findProxyUrl(cssBlobs.map(r => r.value)) ||
      findProxyUrl(proxyStyleElements.map(n => n.nodeValue)) ||
      findProxyUrl(styleAttrs.map(a => a.value));
    if (!proxyUrl) {
      logger.log('warning cannot get proxy url !!');
    }

    logger.log('mapping proxy url', proxyUrl);
    logger.log(`mapping ${cssBlobs.length} css blobs`);
    cssBlobs.forEach(r => (r.value = Buffer.from(doMapProxyUrls(r.value, proxyUrl))));

    logger.log(`mapping ${proxyStyleElements.length} style elements`);
    proxyStyleElements.forEach(n => (n.nodeValue = doMapProxyUrls(n.nodeValue, proxyUrl)));

    logger.log(`mapping ${styleAttrs.length} style attributes`);
    styleAttrs.forEach(a => (a.value = doMapProxyUrls(a.value, proxyUrl)));

    logger.log(`mapping ${allBlobs.length} blob urls`);
    allBlobs.forEach(b => (b.url = doMapProxyUrls(b.url, proxyUrl)));

    logger.log(`mapping ${allBlobs.length} blob urls for sloppy proxy`);
    sloppyMapBlobUrls(frame, proxyUrl);
  };

  function findProxyUrl(arr) {
    let proxyUrl;
    arr.some(text => ((proxyUrl = getProxyUrl(text)), proxyUrl));
    return proxyUrl;
  }

  function doMapProxyUrls(text, proxyUrl) {
    return text.replace(new RegExp(proxyUrl, 'g'), '');
  }

  function sloppyMapBlobUrls(frame, proxyUrl) {
    if (!proxyUrl) {
      return;
    }

    const shortProxyUrl =
      proxyUrl.match(/(https?:\/\/.+:\d+\/)/) && proxyUrl.match(/(https?:\/\/.+:\d+\/)/)[1];
    const originalUrlRegex = new RegExp(`${shortProxyUrl}(.+)$`);
    doMap(frame);

    function doMap(frame) {
      frame.blobs.forEach(b => {
        const originalUrl = b.url.match(originalUrlRegex) && b.url.match(originalUrlRegex)[1];
        if (originalUrl) {
          b.url = absolutizeUrl(originalUrl, frame.url);
        }
      });
      frame.frames.forEach(doMap);
    }
  }

  function getStyleElementsFromFrame(frame) {
    let styleElements = frame.cdt
      .filter(n => n.nodeType === 1 && n.nodeName === 'STYLE')
      .map(n => n.childNodeIndexes);
    styleElements = [].concat
      .apply([], styleElements)
      .map(i => i !== undefined && frame.cdt[i])
      .filter(Boolean);
    return [].concat.apply(
      styleElements,
      frame.frames.map(f => getStyleElementsFromFrame(f)),
    );
  }
}

module.exports = makeMapProxyUrls;
