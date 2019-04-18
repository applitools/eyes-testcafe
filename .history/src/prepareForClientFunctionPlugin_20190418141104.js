'use strict';
// This rollup plugin is meant to fix issues that 
module.exports = {
  generateBundle: function(_outputOptions, bundle, _isWrite) {
    const bundleFile = bundle['processPageAndSerialize.js'];
    bundleFile.code = bundleFile.code.replace('Symbol', 'window.Symbol').trim();
  },
};
