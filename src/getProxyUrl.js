'use strict';

function getProxyUrl(text) {
  const m = text.match(
    /(http(?:s?):\/\/(?:localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):\d{3,5}\/.+?\/)http(?:s?):\/\//,
  );
  return m && m[1];
}

module.exports = getProxyUrl;
