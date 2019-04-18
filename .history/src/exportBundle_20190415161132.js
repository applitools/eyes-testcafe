'use strict';
// This rollup plugin is meant to take the functions defined in processPageAndSerialize
// wrape them in a single function and export it.
module.exports = {
  generateBundle: function(_outputOptions, bundle, _isWrite) {
    const bundleFile = bundle['processPageAndSerialize.js'];

    bundleFile.code = `
    module.exports = () => {
      ${bundleFile.code.replace('module.exports = processPageAndSerialize_1;', '')}
      return processPageAndSerialize()
    }
    `;
  },
};
