'use strict';
// This rollup plugin is meant to take the functions defined in processPageAndSerialize
// wrape them in a single function and export it.
module.exports = {
  generateBundle: function(_outputOptions, bundle, _isWrite) {
    const bundleFile = bundle['processPageAndSerialize.js'];
    const USE_STRICT_RE
    bundleFile.code = bundleFile.code.replace(USE_STRICT_RE, '').trim();
  },
};
