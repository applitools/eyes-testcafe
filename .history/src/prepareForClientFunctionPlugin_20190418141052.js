'use strict';
// This rollup plugin is meant to take the functions defined in processPageAndSerialize
// wrape them in a single function and export it.
module.exports = {
  generateBundle: function(_outputOptions, bundle, _isWrite) {
    const bundleFile = bundle['processPageAndSerialize.js'];
    // Se  https://github.com/DevExpress/testcafe/issues/3713
    bundleFile.code = bundleFile.code.replace('Symbol', 'window.Symbol').trim();
  },
};
