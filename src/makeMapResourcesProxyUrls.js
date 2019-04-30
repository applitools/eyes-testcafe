'use strict';
const {Logger} = require('@applitools/eyes-common');
const logger = new Logger(false, 'testcafe:mapResourcesProxyUrls');

function makeMapResourcesProxyUrls({getResources, getProxyUrl}) {
  return function(frame) {
    let proxyUrl;
    const cssResources = getResources(frame, r => r.type.trimStart().startsWith('text/css'));
    cssResources.forEach(r => (r.value = r.value.toString()));
    cssResources.map(r => r.value).some(css => ((proxyUrl = getProxyUrl(css)), proxyUrl));
    logger.log(`mapping proxy url ${proxyUrl} for ${cssResources.length} resources`);
    cssResources.forEach(r => (r.value = mapCssProxyUrls(r.value, proxyUrl)));
    cssResources.forEach(r => (r.value = Buffer.from(r.value).toString('base64')));
  };

  function mapCssProxyUrls(css, proxyUrl) {
    return css.replace(new RegExp(proxyUrl, 'g'), '');
  }
}

module.exports = makeMapResourcesProxyUrls;
