'use strict';

function getProxyUrl(css) {
  const m = css.match(
    /(http(?:s?):\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{3,5}\/.+?\/)http(?:s?):\/\//,
  );
  return m && m[1];
}

module.exports = getProxyUrl;
