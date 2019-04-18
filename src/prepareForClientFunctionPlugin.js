'use strict';
// This rollup plugin is meant to fix issues that testcafe's ClientFunction has
// See: https://github.com/DevExpress/testcafe/issues/3713
module.exports = {
  generateBundle: function(_outputOptions, bundle, _isWrite) {
    const bundleFile = bundle['processPageAndSerialize.js'];
    const prependWindow = ['Symbol', 'Array', 'Set', 'Object'];
    prependWindow.forEach(token => {
      bundleFile.code = bundleFile.code
        // space or parentheses then token --> space or parentheses then window.token
        .replace(new RegExp(`([ \(]+)(${token})`, 'g'), '$1window.$2')
        .trim();
    });
  },
};
